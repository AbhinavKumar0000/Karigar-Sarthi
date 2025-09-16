<div align="center">
<h1 style="font-size: 3em; color: #4a90e2;">Karigar-Sarthi</h1>
<p style="font-size: 1.2em;">Your AI-Powered Digital Workshop</p>
<p>
<img src="[https://www.google.com/search?q=https://img.shields.io/badge/Python-3776AB%3Fstyle%3Dfor-the-badge%26logo%3Dpython%26logoColor%3Dwhite](https://www.google.com/url?sa=i&url=https%3A%2F%2Fhub.docker.com%2F_%2Fpython&psig=AOvVaw1hDYiqN7aj9VcolKidQbYm&ust=1758100135540000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJCJz8H33I8DFQAAAAAdAAAAABAE)" alt="Python"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Flask-000000%3Fstyle%3Dfor-the-badge%26logo%3Dflask%26logoColor%3Dwhite" alt="Flask"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Google_Cloud-4285F4%3Fstyle%3Dfor-the-badge%26logo%3Dgoogle-cloud%26logoColor%3Dwhite" alt="Google Cloud"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Firebase-FFCA28%3Fstyle%3Dfor-the-badge%26logo%3Dfirebase%26logoColor%3Dblack" alt="Firebase"/>
<img src="https://www.google.com/search?q=https://img.shields.io/badge/JavaScript-F7DF1E%3Fstyle%3Dfor-the-badge%26logo%3Djavascript%26logoColor%3Dblack" alt="JavaScript"/>
</p>
</div>

Karigar-Sarthi (कारीगर-सारथी) is an AI-powered digital workshop that helps Indian artisans with design, pricing, and e-commerce listings, bridging the gap between traditional craft and the digital market. The entire application, including all AI-generated content, is fully bilingual, supporting both English and Hindi.

✨ Key Features
<table width="100%">
<tr>
<td width="50%" valign="top">
<h3>🎨 AI Design Studio</h3>
<ul>
<li><b>Idea Generation</b>: Transform a simple concept into four distinct, visually rich designs based on diverse Indian aesthetic themes.</li>
<li><b>Multi-Angle Views</b>: Generate various photographic angles (side, top-down, 45-degree, lifestyle) for a professional product showcase.</li>
<li><b>Text-Based Editing</b>: Modify existing designs with simple text commands (e.g., "make the background blue").</li>
</ul>
</td>
<td width="50%" valign="top">
<h3>💰 Materials & Pricing</h3>
<ul>
<li><b>Automated Analysis</b>: Upload an image to get a detailed list of required materials and quantities.</li>
<li><b>Cost Breakdown</b>: Provides a complete pricing strategy, including material cost, cost-per-piece, and suggested wholesale/retail prices in INR (₹).</li>
</ul>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🛍️ E-commerce Listings</h3>
<ul>
<li><b>Instant Content</b>: Generate a professional product listing kit from a single image.</li>
<li><b>SEO Optimized</b>: Includes a compelling title, brand story, description, key features, and keywords.</li>
<li><b>Platform Tips</b>: Get specific advice for selling on Amazon Karigar, Flipkart Samarth, and ONDC.</li>
</ul>
</td>
<td width="50%" valign="top">
<h3>🌐 Supplier & Language Support</h3>
<ul>
<li><b>Supplier Discovery</b>: Find online suppliers in India for materials identified by the AI.</li>
<li><b>Bilingual Interface</b>: Toggle between English and Hindi at any time for all UI elements and AI-generated content.</li>
</ul>
</td>
</tr>
</table>

🛠️ Technology Stack
Backend: Python with Flask

Frontend: HTML, CSS, vanilla JavaScript

AI & Cloud:

Google Cloud Platform (GCP) for hosting and services.

Vertex AI for accessing generative models:

Gemini 2.5 Pro: Powers all language understanding, JSON generation, translation, and vision analysis tasks.

Imagen: The underlying model for all image generation and editing functionalities.

Authentication: Firebase Authentication for secure user sign-up and login.

🚀 How It Works
Authentication: The user signs up or logs in.

Input: The artisan provides a text prompt for a new idea or uploads an image of an existing product.

AI Processing: The Flask backend sends the input to the appropriate Vertex AI models. For bilingual support, content is generated in English and then translated to Hindi by Gemini.

Output: The application displays the results in a clean, structured format, be it a design gallery, a cost analysis, or a product listing.

⚙️ Setup and Installation
Clone the repository:

git clone [[https://github.com/your-username/karigar-sarthi.git]([https://github.com/your-username/karigar-sarthi.git](https://github.com/AbhinavKumar0000/Karigar-Sarthi))](https://github.com/AbhinavKumar0000/Karigar-Sarthi)
cd karigar-sarthi

Set up Python Environment:

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Configure Credentials:

Set up a Google Cloud project and enable the Vertex AI API.

Set up a Firebase project and add your config to static/js/auth.js.

Authenticate your environment:

gcloud auth application-default login

Run the Application:

flask run

The app will be available at ...

🤝 Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

📄 License
This project is licensed under the MIT License.
