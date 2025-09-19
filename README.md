<div align="center">
<h1 style="font-size: 3em; color: #4a90e2;">Karigar-Sarthi</h1>
<p style="font-size: 1.2em;">Your AI-Powered Digital Workshop</p>
<p>
<img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=flat" alt="Python">
<img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=flat" alt="Flask">
<img src="https://img.shields.io/badge/Google%20Cloud-4285F4?logo=google-cloud&logoColor=white&style=flat" alt="Google Cloud">
<img src="https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=flat" alt="Firebase">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat" alt="JavaScript">
<img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=flat" alt="CSS3">
<img src="https://img.shields.io/badge/Gemini-8E2BE2?logo=gemini&logoColor=white&style=flat" alt="Gemini">
</p>
</div>

Karigar-Sarthi (कारीगर-सारथी) is an AI-powered digital workshop that helps Indian artisans with design, pricing, and e-commerce listings, bridging the gap between traditional craft and the digital market. The entire application, including all AI-generated content, is fully bilingual, supporting both English and Hindi.

 Key Features
<table width="100%">
<tr>
<td width="50%" valign="top">
<h3> AI Design Studio</h3>
<ul>
<li><b>Idea Generation</b>: Transform a simple concept into four distinct, visually rich designs based on diverse Indian aesthetic themes.</li>
<li><b>Multi-Angle Views</b>: Generate various photographic angles (side, top-down, 45-degree, lifestyle) for a professional product showcase.</li>
<li><b>Text-Based Editing</b>: Modify existing designs with simple text commands (e.g., "make the background blue").</li>
</ul>
</td>
<td width="50%" valign="top">
<h3> Materials & Pricing</h3>
<ul>
<li><b>Automated Analysis</b>: Upload an image to get a detailed list of required materials and quantities.</li>
<li><b>Cost Breakdown</b>: Provides a complete pricing strategy, including material cost, cost-per-piece, and suggested wholesale/retail prices in INR (₹).</li>
</ul>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3> E-commerce Listings</h3>
<ul>
<li><b>Instant Content</b>: Generate a professional product listing kit from a single image.</li>
<li><b>SEO Optimized</b>: Includes a compelling title, brand story, description, key features, and keywords.</li>
<li><b>Platform Tips</b>: Get specific advice for selling on Amazon Karigar, Flipkart Samarth, and ONDC.</li>
</ul>
</td>
<td width="50%" valign="top">
<h3> Supplier & Language Support</h3>
<ul>
<li><b>Supplier Discovery</b>: Find online suppliers in India for materials identified by the AI.</li>
<li><b>Bilingual Interface</b>: Toggle between English and Hindi at any time for all UI elements and AI-generated content.</li>
</ul>
</td>
</tr>
</table>

Technology Stack
Backend: Python with Flask
Frontend: HTML, CSS, vanilla JavaScript

AI & Cloud:
Google Cloud Platform (GCP) for hosting and services.
Vertex AI for accessing generative models:
Gemini 2.5 Pro: Powers all language understanding, JSON generation, translation, and vision analysis tasks.
Imagen: The underlying model for all image generation and editing functionalities.

Authentication: Firebase Authentication for secure user sign-up and login.


How It Works:

Authentication: The user signs up or logs in.

Input: The artisan provides a text prompt for a new idea or uploads an image of an existing product.

AI Processing: The Flask backend sends the input to the appropriate Vertex AI models. For bilingual support, content is generated in English and then translated to Hindi by Gemini.

Output: The application displays the results in a clean, structured format, be it a design gallery, a cost analysis, or a product listing.
