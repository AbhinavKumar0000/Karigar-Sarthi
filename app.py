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

        en_prompt = f"""
            You are an expert artisan and cost estimator in India. Analyze the image and the user's description to generate a list of raw materials and a pricing suggestion.
            User's goal: "{user_description}"
            Return ONLY a valid JSON object with two keys: "materials" and "pricing".
            1. The "materials" key should be a JSON array where each object has "material", "quantity", "reason", and "estimated_cost_inr" keys.
            2. The "pricing" key should be a JSON object with "total_material_cost", "estimated_labor_inr", "profit_margin_percent", "suggested_price_range_inr" (a two-element array of numbers [min, max]), "cost_per_piece_inr" (a number), and "units_per_batch" (a number).
        """
        en_response = model.generate_content([image_part, en_prompt])
        en_data = json.loads(extract_json_from_response(en_response.text))

        hi_prompt = f"""
            You are an expert translator. Translate the 'material' and 'reason' values in the following JSON from English to Hindi.
            Do not translate any other keys or any number values. Return ONLY the translated valid JSON object in the same structure.
            Original JSON: {json.dumps(en_data)}
        """
        hi_response = model.generate_content(hi_prompt)
        hi_data = json.loads(extract_json_from_response(hi_response.text))

        return jsonify({"materials": {"en": en_data, "hi": hi_data}})
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

        en_prompt = f"""
        You are a procurement expert for Indian artisans. For the materials list: "{', '.join(materials)}", find online suppliers in India.
        For each material, generate a DIRECT SEARCH URL to a major e-commerce site like Amazon.in, Flipkart, or a specialty craft store.
        Return ONLY a valid JSON array of objects with "material", "supplier", "link", and "notes" keys. Ensure the link is a functional search URL.
        """
        en_response = model.generate_content(en_prompt)
        en_suppliers = json.loads(extract_json_from_response(en_response.text))

        hi_prompt = f"""
            You are an expert translator. For each object in the following JSON array, translate the 'notes' value from English to Hindi.
            Do not translate any other keys or values. Return ONLY the translated valid JSON array in the same structure.
            Original JSON: {json.dumps(en_suppliers)}
        """
        hi_response = model.generate_content(hi_prompt)
        hi_suppliers = json.loads(extract_json_from_response(hi_response.text))

        return jsonify({"suppliers": {"en": en_suppliers, "hi": hi_suppliers}})
    except Exception as e:
        return jsonify({"error": "Failed to find suppliers.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/generate-product-listing', methods=['POST'])
@login_required
def generate_product_listing():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        user_description = data.get('description', 'a handcrafted item')
        if not image_b64:
            return jsonify({"error": "Missing image data"}), 400

        image_bytes = base64.b64decode(image_b64)
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        model = GenerativeModel("gemini-2.5-pro")

        en_listing_prompt = f"""
        You are an e-commerce expert for Indian artisans. An artisan has uploaded an image of their product and described it as: "{user_description}".
        Analyze the image and description to generate a product listing kit.
        Return ONLY a single, valid JSON object with these keys: "title", "story", "description", "features", "keywords", "platform_tips".
        - "title": A string (max 80 chars).
        - "story": A string (2 paragraphs).
        - "description": A string (3 paragraphs).
        - "features": A JSON array of 5-7 strings.
        - "keywords": A JSON array of 10-15 strings.
        - "platform_tips": A JSON object where keys are "amazon_karigar", "flipkart_samarth", "ondc" and values are strings.
        """
        en_listing_response = model.generate_content([image_part, en_listing_prompt])
        en_listing_data = json.loads(extract_json_from_response(en_listing_response.text))

        # --- MODIFIED SECTION ---
        # This prompt is now more explicit to prevent translation errors.
        hi_listing_prompt = f"""
            You are an expert JSON translator. Your task is to translate specific text fields within a JSON object from English to Hindi.

            RULES:
            1.  Translate ONLY the string values for the following top-level keys: 'title', 'story', 'description'.
            2.  Translate ONLY the string elements within the 'features' array.
            3.  In the 'platform_tips' object, translate ONLY the string values associated with the keys, NOT the keys themselves.
            4.  You MUST NOT translate the 'keywords' array. It must remain in English.
            5.  You MUST NOT translate any JSON keys.
            6.  The output must be a single, valid JSON object with the exact same structure as the input.

            Original English JSON:
            {json.dumps(en_listing_data, indent=2)}
        """
        # --- END OF MODIFIED SECTION ---
        hi_listing_response = model.generate_content(hi_listing_prompt)
        hi_listing_data = json.loads(extract_json_from_response(hi_listing_response.text))

        return jsonify({"listing": {"en": en_listing_data, "hi": hi_listing_data}})
    except Exception as e:
        return jsonify({"error": "Failed to generate product listing.", "details": f"{type(e).__name__}: {str(e)}"}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
