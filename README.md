# Karigar-Sarthi
Karigar-Sarthi (कारीगर-सारथी) is an AI-powered digital workshop that helps Indian artisans with design, pricing, and e-commerce listings, bridging the gap between traditional craft and the digital market.

The entire application, including all AI-generated content, is fully bilingual, supporting both English and Hindi.

Key Features
AI Design Studio:

Idea Generation: Transform a simple concept (e.g., "a wooden elephant toy") into four distinct, visually rich design images based on diverse Indian aesthetic themes (Vibrant, Rustic, Ornate, Modern).

Multi-Angle Views: Generate different photographic angles (side, top-down, 45-degree, lifestyle) for any generated or uploaded design to create a professional product showcase.


Text-Based Editing: Modify existing designs with simple text commands (e.g., "make the background blue," "add floral patterns").

Materials & Pricing Strategy:

Upload an image of a product and provide a brief description.

The AI analyzes the craft to generate a detailed list of required materials, estimated quantities, and their purpose.

It provides a complete pricing breakdown, including total material cost, cost-per-piece, and suggested wholesale and retail prices in INR (₹).

E-commerce Product Listings:

Instantly generate a complete, professional product listing kit from a single image.

The kit includes an SEO-friendly title, a compelling brand story, a detailed description, key features (bullet points), and relevant keywords.

Receive platform-specific tips for selling on major Indian marketplaces like Amazon Karigar, Flipkart Samarth, and ONDC.

Supplier Discovery:

Find online suppliers in India for the materials identified by the AI, complete with direct search links to e-commerce websites.

Bilingual Interface:

Toggle between English and Hindi at any point. All UI elements and AI-generated content are translated in real-time.

 Technology Stack
Backend: Python with Flask

Frontend: HTML, CSS, vanilla JavaScript

AI & Cloud:

Google Cloud Platform (GCP) for hosting and services.

Vertex AI for accessing generative models:

Gemini 2.5 Pro: Powers all language understanding, JSON generation, translation, and vision analysis tasks.

Imagen: The underlying model for all image generation and editing functionalities.

Authentication: Firebase Authentication for secure user sign-up and login.

How It Works
User Authentication: The user signs up or logs in to their account.

Input: The artisan provides an input, which can be:

A text prompt for a new idea in the AI Design Studio.

An uploaded image and text/voice description of an existing product for the main workflow.

AI Processing:

The Flask backend sends the user's input to the appropriate Vertex AI models (Gemini for text/vision, Imagen for image generation).

For multi-language support, the initial request is processed in English, and the structured JSON output is then sent back to Gemini for accurate translation to Hindi.

Output: The application displays the results in a clean, structured format, whether it's a gallery of generated images, a detailed cost analysis, or a ready-to-use product listing. The user can switch the language to see the translated version instantly.




Set up Python Environment:

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


Configure Credentials:

Set up a Google Cloud project and enable the Vertex AI API.

Set up a Firebase project for authentication and add your Firebase config to static/js/auth.js.

Authenticate your environment for Google Cloud:

gcloud auth application-default login


Run the Application:

flask run



Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs, feature requests, or improvements.

