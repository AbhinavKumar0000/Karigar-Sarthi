import base64
import os
import json
import re
from functools import wraps # <-- ADD THIS
from flask import Flask, request, jsonify, render_template, session, redirect, url_for # <-- ADD session, redirect, url_for
from google.cloud import firestore
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.generative_models import GenerativeModel, Part
import google.auth
import firebase_admin # <-- ADD THIS
from firebase_admin import credentials, auth # <-- ADD THIS

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
# ADD A SECRET KEY FOR FLASK SESSIONS
app.secret_key = os.urandom(24) 

# --- Initialize Firebase Admin SDK ---
try:
    # When running on Google Cloud, the Admin SDK can auto-discover credentials
    firebase_admin.initialize_app()
    print("--- Successfully initialized Firebase Admin SDK. ---")
except Exception as e:
    print(f"--- FAILED to initialize Firebase Admin SDK: {e} ---")

# --- Connect to Google Cloud Services ---
try:
    vertexai.init(project=HARDCODED_PROJECT_ID, location=LOCATION)
    db = firestore.Client(project=HARDCODED_PROJECT_ID)
    print("--- Successfully initialized Vertex AI and Firestore. ---")
except Exception as e:
    print(f"--- FAILED to initialize Google Cloud services: {e} ---")


# --- NEW: Login Required Decorator ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function


# --- Helper Function ---
def extract_json_from_response(response_text):
    """
    Robustly extracts a JSON array from the raw text response of an LLM.
    """
    match = re.search(r'```json\s*(\[.*?\])\s*```', response_text, re.DOTALL)
    if match:
        return match.group(1)
    
    match = re.search(r'(\[.*?\])', response_text, re.DOTALL)
    if match:
        return match.group(0)
        
    raise ValueError("Could not find a valid JSON array in the LLM response.")

# --- API Routes ---

@app.route('/')
@login_required # <-- PROTECT THIS ROUTE
def index():
    """Renders the main dashboard page."""
    return render_template('index.html')


# --- NEW: Authentication Routes ---
@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    # This route now serves the login page for GET requests
    if request.method == 'GET':
        return render_template('login.html')
    
    # And handles the session creation for POST requests
    try:
        data = request.get_json()
        token = data.get('token')
        if not token:
            return jsonify({"error": "No token provided"}), 400

        # Verify the ID token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Store user info in the session
        session['user'] = {
            'uid': uid,
            'email': decoded_token.get('email')
        }
        return jsonify({"status": "success", "message": "User session created"}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "Invalid token or server error"}), 401


@app.route('/logout')
def logout():
    session.pop('user', None) # Clear the session
    return redirect(url_for('login_page'))


# --- EXISTING API ROUTES (UNMODIFIED) ---

@app.route('/refine-and-generate-ideas', methods=['POST'])
def refine_and_generate_ideas():
    try:
        data = request.get_json()
        user_prompt = data.get('prompt')
        if not user_prompt:
            return jsonify({"error": "No prompt provided"}), 400

        text_model = GenerativeModel("gemini-2.5-pro")
        refinement_instruction = (
            f"You are a creative guide for an Indian artisan. The user's idea is: '{user_prompt}'. "
            "Your first task is to ensure the output is always an artisan craft object. If the user's prompt is not a craft (e.g., 'a car'), you must reinterpret it as a theme for a craft (e.g., 'a hand-carved wooden toy car with traditional Indian motifs'). "
            "Then, expand the idea into four distinct, highly detailed prompts for an AI image model, reflecting diverse Indian aesthetics. Focus on texture, material, and design rooted in Indian culture, without being limited to specific named styles. "
            "The four styles are: 1. Vibrant & Festive (using bold colors from Indian festivals, celebratory motifs), 2. Earthy & Rustic (using natural materials like clay, jute, wood, with a raw, handcrafted feel), 3. Intricate & Ornate (with fine, detailed carving or filigree work, inspired by royal crafts), 4. Modern & Geometric (a contemporary take on Indian patterns with clean lines and abstract shapes). "
            'Return ONLY a valid JSON array of 4 strings. Example: ["prompt 1", "prompt 2", "prompt 3", "prompt 4"]'
        )
        
        response = text_model.generate_content(refinement_instruction)
        json_string = extract_json_from_response(response.text)
        refined_prompts = json.loads(json_string)

        if not refined_prompts or len(refined_prompts) != 4:
            raise ValueError("LLM did not return the expected 4 prompts in JSON format.")

        image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = []
        for prompt in refined_prompts:
            gen_response = image_model.generate_images(prompt=prompt, number_of_images=1)
            base64_images.append(base64.b64encode(gen_response[0]._image_bytes).decode('utf-8'))

        return jsonify({"images": base64_images, "prompts": refined_prompts})

    except Exception as e:
        return jsonify({"error": "Failed to generate ideas.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/generate-angles', methods=['POST'])
def generate_angles():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        if not image_b64:
            return jsonify({"error": "Missing image data"}), 400

        image_bytes = base64.b64decode(image_b64)
        
        vision_model = GenerativeModel("gemini-2.5-pro")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        
        description_prompt = "You are a master artisan. Describe the object in this image with extreme detail for a fellow artisan. Mention the material, exact colors, specific patterns, texture, and overall craft style. Be factual and precise."
        
        response = vision_model.generate_content([image_part, description_prompt])
        image_description = response.text

        angle_prompts = [
            f"A professional, side profile photograph of this object: '{image_description}', on a seamless, brightly lit white studio background.",
            f"A professional, 45-degree angle three-quarter photograph of this object: '{image_description}', on a seamless, brightly lit white studio background.",
            f"A professional, top-down 'flat lay' photograph of this object: '{image_description}', on a seamless, brightly lit white studio background.",
            f"A realistic lifestyle photograph of this object: '{image_description}', placed in a culturally relevant Indian setting like on a 'charpai' or a 'marble inlay table'."
        ]

        image_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = []
        for prompt in angle_prompts:
            gen_response = image_model.generate_images(prompt=prompt, number_of_images=1)
            base64_images.append(base64.b64encode(gen_response[0]._image_bytes).decode('utf-8'))

        return jsonify({"images": base64_images})

    except Exception as e:
        return jsonify({"error": "Failed to generate angles.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/edit-image', methods=['POST'])
def edit_image():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        user_edit_prompt = data.get('prompt')
        if not all([image_b64, user_edit_prompt]):
            return jsonify({"error": "Missing image data or prompt"}), 400

        image_bytes = base64.b64decode(image_b64)
        
        vision_model = GenerativeModel("gemini-2.5-pro")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        
        description_prompt = "Describe the object in this image in extreme detail for an AI image model. Focus on material, color, patterns, and style. Be factual and precise."
        response = vision_model.generate_content([image_part, description_prompt])
        image_description = response.text
        
        final_generation_prompt = (
            f"You are an expert photo editor. Your task is to edit an image of an artisan craft object. "
            f"The object is described as: '{image_description}'. "
            "You must not change the core shape, material, or primary design of the object. "
            f"Your ONLY task is to apply this specific modification: '{user_edit_prompt}'. "
            "Preserve all other details of the original object to make it look like a direct edit."
        )

        image_generation_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        generation_response = image_generation_model.generate_images(prompt=final_generation_prompt, number_of_images=1)
        
        edited_image_b64 = base64.b64encode(generation_response[0]._image_bytes).decode('utf-8')

        return jsonify({"image": edited_image_b64})

    except Exception as e:
        return jsonify({"error": "Failed to edit image.", "details": f"{type(e).__name__}: {str(e)}"}), 500

@app.route('/get-materials-all-langs', methods=['POST'])
def get_materials_all_langs():
    try:
        data = request.get_json()
        image_b64 = data.get('image_data')
        user_description = data.get('description')

        if not all([image_b64, user_description]):
            return jsonify({"error": "Missing image data or description"}), 400

        image_bytes = base64.b64decode(image_b64)
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")

        model = GenerativeModel("gemini-2.5-pro")

        # Step 1: Generate the list in English first for a reliable structure
        en_prompt = f"""
            You are an expert artisan. Analyze the image and the user's description to generate a list of raw materials needed.
            User's goal: "{user_description}"
            Return ONLY a valid JSON array of objects with "material", "quantity", and "reason" keys in English.
        """
        en_response = model.generate_content([image_part, en_prompt])
        en_json_string = extract_json_from_response(en_response.text)
        en_materials_list = json.loads(en_json_string)

        # Step 2: Translate the English list to Hindi
        hi_prompt = f"""
            You are an expert translator. Translate the 'material' and 'reason' values in the following JSON from English to Hindi.
            Do not translate the 'quantity' value. Return ONLY the translated valid JSON array.
            Original JSON: {json.dumps(en_materials_list)}
        """
        hi_response = model.generate_content(hi_prompt)
        hi_json_string = extract_json_from_response(hi_response.text)
        hi_materials_list = json.loads(hi_json_string)

        # Step 3: Return both lists in a single response object
        return jsonify({"materials": { "en": en_materials_list, "hi": hi_materials_list }})

    except Exception as e:
        return jsonify({"error": "Failed to generate materials lists.", "details": f"{type(e).__name__}: {str(e)}"}), 500


# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
