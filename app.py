import base64
import os
import json
import re
from flask import Flask, request, jsonify, render_template
from google.cloud import firestore
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.preview.generative_models import GenerativeModel, Part
import google.auth

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

# --- Connect to Google Cloud Services ---
try:
    vertexai.init(project=HARDCODED_PROJECT_ID, location=LOCATION)
    db = firestore.Client(project=HARDCODED_PROJECT_ID)
    print("--- Successfully initialized Vertex AI and Firestore. ---")
except Exception as e:
    print(f"--- FAILED to initialize Google Cloud services: {e} ---")

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
def index():
    """Renders the main dashboard page."""
    return render_template('index.html')

@app.route('/refine-and-generate-ideas', methods=['POST'])
def refine_and_generate_ideas():
    try:
        data = request.get_json()
        user_prompt = data.get('prompt')
        if not user_prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # UPGRADE: Using a more powerful and stable model for better results.
        text_model = GenerativeModel("gemini-1.5-flash-preview-0514")
        refinement_instruction = (
            f"You are a creative assistant for an artisan. A user has a simple product idea: '{user_prompt}'. "
            "Your task is to expand this into four distinct, highly detailed prompts for an advanced AI image generation model. "
            "Each prompt should describe a unique style: 1. Minimalist, 2. Ornate/Intricate, 3. Rustic/Handcrafted, 4. Modern/Abstract. "
            "Focus on visual details like material, texture, lighting, patterns, and background. "
            'Return ONLY a valid JSON array of 4 strings, where each string is a detailed prompt. Example format: ["prompt 1", "prompt 2", "prompt 3", "prompt 4"]'
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
        selected_prompt = data.get('selected_prompt')
        if not selected_prompt:
            return jsonify({"error": "Missing selected prompt"}), 400

        text_model = GenerativeModel("gemini-1.5-flash-preview-0514")
        angle_instruction = (
            f"You are a professional product photography assistant. An image generation AI has created an object based on this detailed description: '{selected_prompt}'. "
            "Your task is to generate 4 new prompts to render the *exact same object* but from different camera angles. "
            "The angles are: 1. Side view, 2. 45-degree angle view, 3. Top-down view, 4. A lifestyle shot on a relevant surface (e.g., a wooden table for a rustic item). "
            "For the first three, specify a seamless, professional white studio background. "
            'Return ONLY a valid JSON array of 4 strings, where each string is a new prompt for a specific angle.'
        )

        response = text_model.generate_content(angle_instruction)
        
        json_string = extract_json_from_response(response.text)
        angle_prompts = json.loads(json_string)

        if not angle_prompts or len(angle_prompts) != 4:
            raise ValueError("LLM did not return the expected 4 angle prompts in JSON format.")

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
        
        vision_model = GenerativeModel("gemini-1.5-flash-preview-0514")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        
        description_prompt = "Describe this image for an image generation model. Be factual and concise. Focus on the main subject, its style, and the background."
        
        response = vision_model.generate_content([image_part, description_prompt])
        image_description = response.text
        
        final_generation_prompt = f"{image_description}, but now {user_edit_prompt}."

        image_generation_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        generation_response = image_generation_model.generate_images(prompt=final_generation_prompt, number_of_images=1)
        
        edited_image_b64 = base64.b64encode(generation_response[0]._image_bytes).decode('utf-8')

        return jsonify({"image": edited_image_b64})

    except Exception as e:
        return jsonify({"error": "Failed to edit image.", "details": f"{type(e).__name__}: {str(e)}"}), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

