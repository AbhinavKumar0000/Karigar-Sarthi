import base64
import os
import time
import random
from flask import Flask, request, jsonify, render_template
from google.cloud import firestore
from google.api_core import exceptions
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel, Image
from vertexai.preview.generative_models import GenerativeModel, Part

# --- Initialization ---
app = Flask(__name__)

# --- Configuration ---
PROJECT_ID = "burnished-sweep-471303-v4"
LOCATION = "us-central1"

# --- Connect to Google Cloud Services ---
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    db = firestore.Client(project=PROJECT_ID)
    print("--- Successfully initialized Vertex AI and Firestore. ---")
except Exception as e:
    print(f"--- FAILED to initialize Google Cloud services: {e} ---")


# --- Helper Functions for Prompt Engineering ---

def create_ideation_prompts(base_prompt):
    """
    Creates 4 stylistically different prompts to generate a range of ideas.
    """
    styles = [
        f"A minimalist {base_prompt}, clean lines, simple form, professional product photo, white background, studio lighting.",
        f"An intricately detailed {base_prompt} with elaborate patterns, ornate design, professional product photo, dark background, dramatic lighting.",
        f"A rustic, handcrafted {base_prompt} with a rough, earthy texture, professional product photo, natural light, on a wooden surface.",
        f"A modern, geometric {base_prompt} with bold shapes and abstract patterns, professional product photo, bright, colorful background."
    ]
    return styles

def create_angle_prompts(selected_prompt):
    """
    Refines prompts to be more forceful about object consistency for angle generation.
    """
    angles = [
        f"{selected_prompt} | An image of this exact same object from the side view. Seamless white background. Professional product photography.",
        f"{selected_prompt} | An image of this exact same object from a 45-degree angle view. Seamless white background. Professional product photography.",
        f"{selected_prompt} | An image of this exact same object from a top-down view. Seamless white background. Professional product photography.",
        f"{selected_prompt} | A lifestyle photograph of this exact same object, placed naturally on a rustic wooden table."
    ]
    return angles

# --- API Routes ---

@app.route('/')
def index():
    """Renders the main dashboard page."""
    return render_template('index.html')

@app.route('/generate-ideas', methods=['POST'])
def generate_ideas():
    """
    STAGE 1: Generates four design ideas and the prompts.
    """
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "No prompt provided"}), 400

        user_prompt = data['prompt']
        ideation_prompts = create_ideation_prompts(user_prompt)
        
        model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = []
        
        print(f"Generating {len(ideation_prompts)} ideas.")

        for prompt in ideation_prompts:
            # FIX: Removed 'seed' parameter as it's not compatible with watermarking.
            response = model.generate_images(prompt=prompt, number_of_images=1)
            img_bytes = response[0]._image_bytes
            base64_images.append(base64.b64encode(img_bytes).decode('utf-8'))

        print("Successfully generated ideas.")
        return jsonify({"images": base64_images, "prompts": ideation_prompts})

    except Exception as e:
        error_type = type(e).__name__
        error_details = str(e)
        return jsonify({"error": "Failed to generate ideas.", "details": f"{error_type}: {error_details}"}), 500

@app.route('/generate-angles', methods=['POST'])
def generate_angles():
    """
    STAGE 2: Receives a prompt and generates different angles of the same object.
    """
    try:
        data = request.get_json()
        if not data or 'selected_prompt' not in data:
            return jsonify({"error": "Missing prompt"}), 400

        selected_prompt = data['selected_prompt']
        angle_prompts = create_angle_prompts(selected_prompt)
        model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        base64_images = []

        print(f"Generating {len(angle_prompts)} angles.")
        for prompt in angle_prompts:
            # FIX: Removed 'seed' parameter. Consistency relies on the detailed prompt.
            response = model.generate_images(prompt=prompt, number_of_images=1)
            img_bytes = response[0]._image_bytes
            base64_images.append(base64.b64encode(img_bytes).decode('utf-8'))

        print("Successfully generated angles.")
        return jsonify({"images": base64_images})

    except Exception as e:
        error_type = type(e).__name__
        error_details = str(e)
        return jsonify({"error": "Failed to generate angles.", "details": f"{error_type}: {error_details}"}), 500

@app.route('/edit-image', methods=['POST'])
def edit_image():
    """
    STAGE 3: Describes an uploaded image with a multimodal model, then combines the
    description with the user's edit prompt to generate a new, edited image.
    """
    try:
        data = request.get_json()
        if not data or 'image_data' not in data or 'prompt' not in data:
            return jsonify({"error": "Missing image data or prompt"}), 400

        image_b64 = data['image_data']
        user_edit_prompt = data['prompt']
        
        image_bytes = base64.b64decode(image_b64)

        # 1. Describe the image using Gemini Pro Vision
        # FIX: Changed model name to the correct, generally available version.
        vision_model = GenerativeModel("gemini-pro-vision")
        image_part = Part.from_data(data=image_bytes, mime_type="image/png")
        
        print("Describing uploaded image with Gemini Pro Vision...")
        description_prompt = "Describe this image for an image generation model. Be factual and concise. Focus on the main subject, its style, and the background."
        response = vision_model.generate_content([image_part, description_prompt])
        image_description = response.text
        print(f"Image description: {image_description}")

        # 2. Combine description with user's edit prompt
        final_generation_prompt = f"{image_description}, but now {user_edit_prompt}."
        print(f"Final generation prompt: '{final_generation_prompt}'")

        # 3. Generate a new image using the combined prompt
        image_generation_model = ImageGenerationModel.from_pretrained("imagegeneration@006")
        
        generation_response = image_generation_model.generate_images(
            prompt=final_generation_prompt,
            number_of_images=1
        )
        
        img_bytes = generation_response[0]._image_bytes
        edited_image_b64 = base64.b64encode(img_bytes).decode('utf-8')

        print("Successfully generated edited image.")
        return jsonify({"image": edited_image_b64})

    except Exception as e:
        error_type = type(e).__name__
        error_details = str(e)
        print(f"An error occurred during image editing: {error_type}: {error_details}")
        return jsonify({"error": "Failed to edit image.", "details": f"{error_type}: {error_details}"}), 500


# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

