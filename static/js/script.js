document.addEventListener('DOMContentLoaded', () => {
    // Stage 1 Elements
    const stage1 = document.getElementById('stage-1-ideation');
    const ideaForm = document.getElementById('idea-form');
    const promptInput = document.getElementById('prompt-input');
    const ideaGallery = document.getElementById('idea-gallery');
    const ideaGalleryContainer = document.getElementById('idea-gallery-container');
    const ideaLoadingSpinner = document.getElementById('idea-loading-spinner');

    // Stage 2 Elements
    const stage2 = document.getElementById('stage-2-angles');
    const selectedImageDisplay = document.getElementById('selected-image-display');
    const angleGallery = document.getElementById('angle-gallery');
    const angleLoadingSpinner = document.getElementById('angle-loading-spinner');
    const resetButton = document.getElementById('reset-button');

    // Stage 3 Elements
    const stage3 = document.getElementById('stage-3-edit');
    const editForm = document.getElementById('edit-form');
    const imageUploadInput = document.getElementById('image-upload-input');
    const editPromptInput = document.getElementById('edit-prompt-input');
    const imagePreview = document.getElementById('image-preview');
    const editedImageResult = document.getElementById('edited-image-result');
    const editGalleryContainer = document.getElementById('edit-gallery-container');
    const editLoadingSpinner = document.getElementById('edit-loading-spinner');

    // Shared Elements
    const errorContainer = document.getElementById('error-container');
    
    // --- STATE ---
    let generatedPrompts = [];
    let uploadedImageBase64 = null;

    // --- STAGE 1: GENERATE IDEAS ---
    ideaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!promptInput.value) return;

        resetUI(false); // Reset partially, keep edit section visible
        ideaLoadingSpinner.classList.remove('hidden');

        try {
            const response = await fetch('/generate-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptInput.value }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Failed to generate ideas.');

            generatedPrompts = data.prompts;
            displayImages(data.images, ideaGallery, handleIdeaSelection);
            ideaGalleryContainer.classList.remove('hidden');
        } catch (error) {
            showError(`Error during idea generation: ${error.message}`);
        } finally {
            ideaLoadingSpinner.classList.add('hidden');
        }
    });

    // --- STAGE 2: GENERATE ANGLES ---
    async function handleIdeaSelection(event) {
        const selectedIndex = event.currentTarget.dataset.index;
        const selectedPrompt = generatedPrompts[selectedIndex];
        const selectedImageSrc = event.currentTarget.src;

        stage1.classList.add('hidden');
        stage2.classList.remove('hidden');
        angleGallery.innerHTML = '';
        selectedImageDisplay.innerHTML = `<img src="${selectedImageSrc}" alt="Selected Design">`;
        angleLoadingSpinner.classList.remove('hidden');
        hideError();

        try {
            const response = await fetch('/generate-angles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selected_prompt: selectedPrompt }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Failed to generate angles.');

            displayImages(data.images, angleGallery);
        } catch (error) {
            showError(`Error during angle generation: ${error.message}`);
        } finally {
            angleLoadingSpinner.classList.add('hidden');
        }
    }

    // --- STAGE 3: UPLOAD AND EDIT IMAGE ---
    imageUploadInput.addEventListener('change', () => {
        const file = imageUploadInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                uploadedImageBase64 = reader.result.split(',')[1];
                imagePreview.innerHTML = `<img src="${reader.result}" alt="Image Preview">`;
                editGalleryContainer.classList.remove('hidden');
                editedImageResult.innerHTML = `<h4>Edited</h4>`; // Reset edited view
            };
            reader.readAsDataURL(file);
        }
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!uploadedImageBase64 || !editPromptInput.value) {
            showError("Please upload an image and provide an edit instruction.");
            return;
        }
        
        editLoadingSpinner.classList.remove('hidden');
        editedImageResult.innerHTML = `<h4>Edited</h4>`;
        hideError();

        try {
            const response = await fetch('/edit-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_data: uploadedImageBase64, prompt: editPromptInput.value }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.details || 'Failed to edit image.');
            
            editedImageResult.innerHTML = `<h4>Edited</h4><img src="data:image/png;base64,${data.image}" alt="Edited Result">`;

        } catch (error) {
            showError(`Error during image editing: ${error.message}`);
        } finally {
            editLoadingSpinner.classList.add('hidden');
        }
    });

    // --- UI UTILITY FUNCTIONS ---
    function resetUI(fullReset = true) {
        stage1.classList.remove('hidden');
        stage2.classList.add('hidden');
        ideaGallery.innerHTML = '';
        angleGallery.innerHTML = '';
        ideaGalleryContainer.classList.add('hidden');
        promptInput.value = '';
        hideError();

        if (fullReset) {
            stage3.classList.remove('hidden');
            editGalleryContainer.classList.add('hidden');
            imagePreview.innerHTML = '<h4>Original</h4>';
            editedImageResult.innerHTML = '<h4>Edited</h4>';
            editPromptInput.value = '';
            imageUploadInput.value = null;
        }
    }
    
    function displayImages(images, galleryElement, clickHandler) {
        galleryElement.innerHTML = '';
        images.forEach((base64Image, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `data:image/png;base64,${base64Image}`;
            imgElement.alt = "Generated AI Design";
            imgElement.dataset.index = index;

            if (clickHandler) {
                imgElement.addEventListener('click', clickHandler);
                imgElement.classList.add('selectable');
            }
            galleryElement.appendChild(imgElement);
        });
    }

    resetButton.addEventListener('click', () => resetUI(true));

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    function hideError() {
        errorContainer.classList.add('hidden');
    }
});

