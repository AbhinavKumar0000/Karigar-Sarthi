import base64
import os
import json
import re
from functools import wraps
from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from google.cloud import firestore
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.generative_models import GenerativeModel, Part
import google.auth
import firebase_admin
from firebase_admin import credentials, auth

# --- Configuration & Pre-flight Check ---
HARDCODED_PROJECT_ID = "burnished-sweep-471303-v4"
LOCATION = "us-central1"

try:
    credentials, project_id = google.auth.default()
    detected_project_id = project_id or os.environ.get('GOOGLE_CLOUD_PROJECT')
    if detected_project_id:
        print(f"--- DIAGNOSTIC: Found credentials. Project ID is '{detected_project_id}' ---")
    else:
        print("--- DIAGNOSTIC WARNING: Credentials found, but no Project ID was detected. ---")
except Exception as e:
    print(f"--- DIAGNOSTIC FAILED: Could not find Google Cloud credentials. Error: {e} ---")

# --- Initialization ---
app = Flask(__name__)
app.secret_key = os.urandom(24)

try:
    firebase_admin.initialize_app()
    print("--- Successfully initialized Firebase Admin SDK. ---")
except Exception as e:
    print(f"--- FAILED to initialize Firebase Admin SDK: {e} ---")

try:
    vertexai.init(project=HARDCODED_PROJECT_ID, location=LOCATION)
    db = firestore.Client(project=HARDCODED_PROJECT_ID)
    print("--- Successfully initialized Vertex AI and Firestore. ---")
except Exception as e:
    print(f"--- FAILED to initialize Google Cloud services: {e} ---")

# --- Login Required Decorator ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                 return jsonify({"error": "Authentication required"}), 401
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

# --- Helper Function ---
def extract_json_from_response(response_text):
    match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
    if match:
        return match.group(1)
    match = re.search(r'({.*}|\[.*\])', response_text, re.DOTALL)
    if match:
        return match.group(0)
    raise ValueError("Could not find a valid JSON object or array in the LLM response.")

# --- Page Routes ---
@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'GET':
        return render_template('login.html')
    try:
        data = request.get_json()
        token = data.get('token')
        if not token: return jsonify({"error": "No token provided"}), 400
        decoded_token = auth.verify_id_token(token)
        session['user'] = {'uid': decoded_token['uid'], 'email': decoded_token.get('email')}
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": "Invalid token or server error"}), 401

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login_page'))

# --- API Routes ---
@app.route('/refine-and-generate-ideas', methods=['POST'])
@login_required
def refine_and_generate_ideas():
    try:
        data = request.get_json()
        user_prompt = data.get('prompt')
        if not user_prompt: return jsonify({"error": "No prompt provided"}), 400
        text_model = GenerativeModel("gemini-2.5-pro")
        refinement_instruction = (
             f"You are a creative guide for an Indian artisan. The user's idea is: '{user_prompt}'. "
            "Reinterpret the idea as a physical artisan craft object. Then, expand it into four distinct, highly detailed prompts for an AI image model, reflecting diverse Indian aesthetics: 1. Vibrant & Festive, 2. Earthy & Rustic, 3. Intricate & Ornate, 4. Modern & Geometric. "
            'Return ONLY a valid JSON array of 4 strings.'
        )
        response = text_model.generate_content(refinement_instruction)
        refined_prompts = json.loads(extract_json_from_response(response.text))
        image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = [base64.b64encode(img._image_bytes).decode('utf-8') for img in image_model.generate_images(prompts=refined_prompts)]
        return jsonify({"images": base64_images, "prompts": refined_prompts})
    except Exception as e:
        return jsonify({"error": "Failed to generate ideas.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/generate-angles', methods=['POST'])
@login_required
def generate_angles():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        if not image_b64: return jsonify({"error": "Missing image data"}), 400
        image_bytes = base64.b64decode(image_b64)
        vision_model = GenerativeModel("gemini-2.5-pro")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        response = vision_model.generate_content([image_part, "Describe this object in extreme detail for a fellow artisan."])
        image_description = response.text
        angle_prompts = [
            f"Side profile photograph of this object: '{image_description}', on a brightly lit white studio background.",
            f"45-degree angle photograph of this object: '{image_description}', on a brightly lit white studio background.",
            f"Top-down 'flat lay' photograph of this object: '{image_description}', on a brightly lit white studio background.",
            f"Lifestyle photograph of this object: '{image_description}', in a culturally relevant Indian setting."
        ]
        image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = [base64.b64encode(img._image_bytes).decode('utf-8') for img in image_model.generate_images(prompts=angle_prompts)]
        return jsonify({"images": base64_images})
    except Exception as e:
        return jsonify({"error": "Failed to generate angles.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/edit-image', methods=['POST'])
@login_required
def edit_image():
    try:
        data = request.get_json()
        image_b64, user_edit_prompt = data.get('image_data'), data.get('prompt')
        if not all([image_b64, user_edit_prompt]): return jsonify({"error": "Missing image data or prompt"}), 400
        image_bytes = base64.b64decode(image_b64)
        vision_model = GenerativeModel("gemini-2.5-pro")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        response = vision_model.generate_content([image_part, "Describe this object in extreme detail for an AI image model."])
        image_description = response.text
        final_prompt = (f"Edit an image of an artisan object described as: '{image_description}'. Apply this modification ONLY: '{user_edit_prompt}'. Preserve all other details.")
        image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        gen_response = image_model.generate_images(prompt=final_prompt, number_of_images=1)
        edited_image_b64 = base64.b64encode(gen_response[0]._image_bytes).decode('utf-8')
        return jsonify({"image": edited_image_b64})
    except Exception as e:
        return jsonify({"error": "Failed to edit image.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/get-materials-all-langs', methods=['POST'])
@login_required
def get_materials_all_langs():
    try:
        data = request.get_json()
        image_b64, user_description = data.get('image_data'), data.get('description')
        if not all([image_b64, user_description]): return jsonify({"error": "Missing image data or description"}), 400
        image_bytes = base64.b64decode(image_b64)
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        model = GenerativeModel("gemini-2.5-pro")
        en_prompt = f"Analyze the image and user's goal ('{user_description}') to list raw materials. Return ONLY a valid JSON array of objects with 'material', 'quantity', 'reason' keys in English."
        en_response = model.generate_content([image_part, en_prompt])
        en_materials_list = json.loads(extract_json_from_response(en_response.text))
        hi_prompt = f"Translate 'material' and 'reason' in this JSON to Hindi. Do not translate quantity. Return ONLY the translated JSON array. Original: {json.dumps(en_materials_list)}"
        hi_response = model.generate_content(hi_prompt)
        hi_materials_list = json.loads(extract_json_from_response(hi_response.text))
        return jsonify({"materials": {"en": en_materials_list, "hi": hi_materials_list}})
    except Exception as e:
        return jsonify({"error": "Failed to get materials.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/find-suppliers', methods=['POST'])
@login_required
def find_suppliers():
    try:
        data = request.get_json()
        materials = data.get('materials')
        if not materials: return jsonify({"error": "No materials provided"}), 400
        model = GenerativeModel("gemini-2.5-pro")
        # UPDATED PROMPT for more accuracy
        prompt = f"""
        You are a procurement expert for Indian artisans. For the materials list: "{', '.join(materials)}", find online suppliers in India.
        For each material, generate a DIRECT SEARCH URL to a major e-commerce site like Amazon.in, Flipkart, or a specialty craft store.
        For example, for 'Terracotta Clay', the link should be 'https://www.amazon.in/s?k=terracotta+clay+for+crafts', not just 'https://www.amazon.in'.
        
        Return ONLY a valid JSON array of objects with "material", "supplier", "link", and "notes" keys. Ensure the link is a functional search URL.
        """
        response = model.generate_content(prompt)
        suppliers_list = json.loads(extract_json_from_response(response.text))
        return jsonify(suppliers_list)
    except Exception as e:
        return jsonify({"error": "Failed to find suppliers.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/generate-product-listing', methods=['POST'])
@login_required
def generate_product_listing():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        # UPDATED to use 'description' from user instead of 'prompt'
        user_description = data.get('description', 'a handcrafted item') 
        if not image_b64:
            return jsonify({"error": "Missing image data"}), 400

        image_bytes = base64.b64decode(image_b64)
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        model = GenerativeModel("gemini-2.5-pro")

        # UPDATED PROMPT to use the user's description
        listing_prompt = f"""
        You are an e-commerce expert for Indian artisans. An artisan has uploaded an image of their product and described it as: "{user_description}".
        Analyze the image and the description to generate a complete product listing kit. The tone must be authentic and appealing.
        
        Return ONLY a single, valid JSON object with these keys: "title", "story", "description", "features", "keywords", "platform_tips".
        - "title": An SEO-friendly title (max 80 chars).
        - "story": A compelling "Story Behind the Craft" (2 paragraphs).
        - "description": A detailed product description (3 paragraphs).
        - "features": A JSON array of 5-7 key feature bullet points.
        - "keywords": A JSON array of 10-15 SEO keywords.
        - "platform_tips": A JSON object with string tips for "amazon_karigar", "flipkart_samarth", and "ondc".
        """
        listing_response = model.generate_content([image_part, listing_prompt])
        listing_data = json.loads(extract_json_from_response(listing_response.text))

        return jsonify(listing_data)

    except Exception as e:
        return jsonify({"error": "Failed to generate product listing.", "details": f"{type(e).__name__}: {str(e)}"}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

