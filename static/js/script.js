document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const ideaForm = document.getElementById('idea-form');
    const ideaPromptInput = document.getElementById('idea-prompt-input');
    const editForm = document.getElementById('edit-form');
    const editPromptInput = document.getElementById('edit-prompt-input');
    const imageUploadInput = document.getElementById('image-upload-input');

    // Modules
    const angleModule = document.getElementById('angle-module');
    const editModule = document.getElementById('edit-module');

    // Gallery and Loader elements
    const ideaGallery = document.getElementById('idea-gallery');
    const ideaGalleryContainer = document.getElementById('idea-gallery-container');
    const ideaGalleryLoader = document.getElementById('idea-gallery-loader');

    const angleGallery = document.getElementById('angle-gallery');
    const angleGalleryContainer = document.getElementById('angle-gallery-container');
    const angleGalleryLoader = document.getElementById('angle-gallery-loader');

    const editedImageContainer = document.getElementById('edited-image-container');
    const editedImageLoader = document.getElementById('edited-image-loader');
    
    // Edit section elements
    const imageToEditPreview = document.getElementById('image-to-edit-preview');
    const uploadPrompt = document.getElementById('upload-prompt');

    // Store data between stages
    let activePrompts = [];
    let imageForEditingB64 = null;

    // --- HELPER FUNCTIONS ---
    function showLoader(loader) { loader.classList.remove('hidden'); }
    function hideLoader(loader) { loader.classList.add('hidden'); }
    function clearGallery(gallery) { gallery.innerHTML = ''; }
    
    function displayError(container, error) {
        container.innerHTML = `<div class="error-message"><strong>Error:</strong> ${error.error || 'An unknown error occurred.'} ${error.details || ''}</div>`;
    }

    function setupImageForEditing(base64Data) {
        imageForEditingB64 = base64Data;
        imageToEditPreview.src = `data:image/png;base64,${base64Data}`;
        imageToEditPreview.classList.remove('hidden');
        uploadPrompt.classList.add('hidden');
        editModule.classList.remove('hidden');
        editModule.scrollIntoView({ behavior: 'smooth' });
    }

    // --- EVENT LISTENERS ---

    // STAGE 1: Generate Ideas
    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = ideaPromptInput.value;
        if (!prompt) return;

        clearGallery(ideaGallery);
        ideaGalleryContainer.classList.add('hidden');
        showLoader(ideaGalleryLoader);
        angleModule.classList.add('hidden');
        editModule.classList.add('hidden');

        try {
            const response = await fetch('/refine-and-generate-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();

            if (!response.ok) throw data;

            activePrompts = data.prompts;
            ideaGallery.innerHTML = data.images.map((imgB64, index) => `
                <div class="image-container">
                    <img src="data:image/png;base64,${imgB64}" alt="Generated AI Design" data-prompt-index="${index}" data-b64="${imgB64}">
                    <div class="overlay">
                        <button class="select-design-btn">Select this Design</button>
                        <button class="edit-idea-btn">Edit this Image</button>
                    </div>
                </div>
            `).join('');
            ideaGalleryContainer.classList.remove('hidden');

        } catch (error) {
            displayError(ideaGallery, error);
        } finally {
            hideLoader(ideaGalleryLoader);
        }
    });

    // Handle clicks within the idea gallery
    ideaGallery.addEventListener('click', e => {
        if (e.target.classList.contains('select-design-btn')) {
            const img = e.target.closest('.image-container').querySelector('img');
            const promptIndex = img.dataset.promptIndex;
            generateAngles(activePrompts[promptIndex]);
        }
        if (e.target.classList.contains('edit-idea-btn')) {
            const img = e.target.closest('.image-container').querySelector('img');
            setupImageForEditing(img.dataset.b64);
        }
    });

    // STAGE 2: Generate Angles
    async function generateAngles(selectedPrompt) {
        angleModule.classList.remove('hidden');
        clearGallery(angleGallery);
        angleGalleryContainer.classList.add('hidden');
        showLoader(angleGalleryLoader);
        editModule.classList.add('hidden');
        angleModule.scrollIntoView({ behavior: 'smooth' });

        try {
            const response = await fetch('/generate-angles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selected_prompt: selectedPrompt }),
            });
            const data = await response.json();
            if (!response.ok) throw data;

            angleGallery.innerHTML = data.images.map(imgB64 => `
                 <div class="image-container">
                    <img src="data:image/png;base64,${imgB64}" alt="Generated Angle" data-b64="${imgB64}">
                     <div class="overlay">
                        <button class="edit-idea-btn">Edit this Image</button>
                    </div>
                </div>
            `).join('');
            angleGalleryContainer.classList.remove('hidden');

        } catch (error) {
            displayError(angleGallery, error);
        } finally {
            hideLoader(angleGalleryLoader);
        }
    }
    
    // Handle clicks within the angle gallery
    angleGallery.addEventListener('click', e => {
        if (e.target.classList.contains('edit-idea-btn')) {
            const img = e.target.closest('.image-container').querySelector('img');
            setupImageForEditing(img.dataset.b64);
        }
    });


    // STAGE 3: Edit an Image
    imageUploadInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = event => {
            const base64String = event.target.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            setupImageForEditing(base64String);
        };
        reader.readAsDataURL(file);
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prompt = editPromptInput.value;
        if (!prompt || !imageForEditingB64) {
            alert('Please select an image and provide an edit instruction.');
            return;
        }

        clearGallery(editedImageContainer);
        showLoader(editedImageLoader);

        try {
            const response = await fetch('/edit-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, image_data: imageForEditingB64 }),
            });
            const data = await response.json();
            if (!response.ok) throw data;

            editedImageContainer.innerHTML = `<img src="data:image/png;base64,${data.image}" alt="Edited Result">`;

        } catch (error) {
            displayError(editedImageContainer, error);
        } finally {
            hideLoader(editedImageLoader);
        }
    });
});

