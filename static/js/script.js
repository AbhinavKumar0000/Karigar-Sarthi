document.addEventListener('DOMContentLoaded', () => {
    const designForm = document.getElementById('design-form');
    const promptInput = document.getElementById('prompt-input');
    const imageGallery = document.getElementById('image-gallery');
    const loadingSpinner = document.getElementById('loading-spinner');
    const generateBtn = document.getElementById('generate-btn');

    designForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a product idea.');
            return;
        }

        // --- UI Updates: Show loading and disable button ---
        loadingSpinner.classList.remove('hidden');
        imageGallery.innerHTML = ''; // Clear previous images
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            const response = await fetch('/generate-design', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            // This block now handles the detailed error from the backend
            if (!response.ok) {
                const errorData = await response.json();
                // Use the new 'details' field for a more specific error message
                throw new Error(errorData.details || errorData.error || 'An unknown server error occurred.');
            }

            const data = await response.json();

            // Create and append images to the gallery
            if (data.images && data.images.length > 0) {
                data.images.forEach(base64Image => {
                    const imgElement = document.createElement('img');
                    imgElement.src = `data:image/png;base64,${base64Image}`;
                    imgElement.alt = "Generated AI Design";
                    imageGallery.appendChild(imgElement);
                });
            } else {
                imageGallery.textContent = 'No images were generated. Please try a different prompt.';
            }

        } catch (error) {
            console.error('Error generating images:', error);
            // Display the detailed error message to the user
            imageGallery.textContent = `Error: ${error.message}`;
        } finally {
            // --- UI Updates: Hide loading and re-enable button ---
            loadingSpinner.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Images';
        }
    });
});

