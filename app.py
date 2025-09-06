import base64
import os
from flask import Flask, request, jsonify, render_template
from google.cloud import firestore
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

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


# --- Helper Function for Prompt Engineering ---
def create_artisan_prompts(base_prompt):
    """
    Takes a simple user prompt and creates multiple, detailed prompts
    for generating professional-looking product images from different angles,
    ensuring product consistency.
    """
    # --- THIS IS THE FIX ---
    # Add a unique, consistent detail to help the AI generate the *same* object.
    consistent_prompt = f"A single, specific {base_prompt}, featuring a unique, small, hand-painted blue bird emblem near the base."

    styles = [
        # Explicitly ask for the "exact same object" in each view.
        "front view of the exact same object, professional product photography on a seamless white background, studio lighting",
        "side view of the exact same object, professional product photography on a seamless white background, studio lighting",
        "45-degree angle view of the exact same object, professional product photography on a seamless white background, studio lighting",
        "lifestyle photo of the exact same object, placed on a rustic wooden table with soft, natural light"
    ]
    return [f"{consistent_prompt}, {style}" for style in styles]

# --- API Routes ---

@app.route('/')
def index():
    """Renders the main dashboard page."""
    return render_template('index.html')

@app.route('/generate-design', methods=['POST'])
def generate_design():
    """
    Receives a prompt, generates multiple images using Vertex AI's Imagen,
    and returns them as Base64 encoded strings.
    """
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "No prompt provided"}), 400

        user_prompt = data['prompt']
        engineered_prompts = create_artisan_prompts(user_prompt)
        model = ImageGenerationModel.from_pretrained("imagegeneration@005")

        base64_images = []
        print(f"Generating images for {len(engineered_prompts)} prompts...")

        for single_prompt in engineered_prompts:
            print(f"  - Generating for: '{single_prompt[:70]}...'")
            response = model.generate_images(
                prompt=single_prompt,
                number_of_images=1
            )
            img_bytes = response[0]._image_bytes
            base64_images.append(base64.b64encode(img_bytes).decode('utf-8'))

        print(f"Successfully generated {len(base64_images)} images.")
        return jsonify({"images": base64_images})

    except Exception as e:
        error_type = type(e).__name__
        error_details = str(e)
        print(f"An error occurred during image generation. Type: {error_type}, Details: {error_details}")
        return jsonify({
            "error": "Failed to generate images due to a server error.",
            "details": f"Error Type: {error_type}. Details: {error_details}"
        }), 500

# --- Main Execution ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

