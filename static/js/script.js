document.addEventListener('DOMContentLoaded', () => {
    // --- Translations ---
    const translations = {
        en: {
            main_title: "Karigar-Sarthi",
            subtitle: "Your AI-Powered Digital Workshop",
            lang_en: "EN", lang_hi: "HI",
            idea_title: "1. Create a New Idea",
            idea_desc: "Describe your concept, and our AI will generate four unique designs inspired by diverse Indian aesthetics.",
            idea_placeholder: "e.g., 'a wooden elephant toy', 'a terracotta Diya'",
            idea_button: "Generate Designs",
            upload_title: "2. Create Listing from Image",
            upload_desc: "Upload a photo of your finished craft, describe it, and we'll generate all the details for your online store.",
            upload_button: "Upload Your Image",
            listing_from_upload_placeholder: "Briefly describe your product. e.g., 'Hand-painted wooden coasters with Madhubani art, set of 4.'",
            results_title: "Generated Designs",
            results_desc: "Click an image to select it for the next steps.",
            angle_title: "Generate Different Angles",
            angle_desc: "Create professional product shots for your selected design.",
            angle_button: "Generate 4 Angles",
            edit_title: "Edit Your Design",
            edit_desc: "Describe the changes you want to make to the selected photo.",
            edit_placeholder: "e.g., 'make the background blue'",
            edit_button: "Apply Edit",
            material_title: "3. Plan Your Craft & Get Materials",
            material_desc: "Upload a base image, then describe the final product you want to create. Our AI will generate a list of materials you'll need.",
            material_upload_button: "Upload Base Image",
            material_placeholder: "Describe the final product. For example: 'I want to make this wooden toy, but paint it blue with yellow floral patterns and add small wheels.'",
            material_button: "Get Materials List",
            material_results_title: "Suggested Materials",
            find_suppliers_button: "Find Online Suppliers",
            suppliers_title: "Online Suppliers",
            listing_button: "Generate Listing Details",
        },
        hi: {
            main_title: "कारीगर-सारथी",
            subtitle: "आपकी एआई-संचालित डिजिटल कार्यशाला",
            lang_en: "EN", lang_hi: "HI",
            idea_title: "१. एक नया विचार बनाएं",
            idea_desc: "अपनी अवधारणा का वर्णन करें, और हमारा एआई विविध भारतीय सौंदर्यशास्त्र से प्रेरित चार अद्वितीय डिजाइन तैयार करेगा।",
            idea_placeholder: "उदा., 'लकड़ी का हाथी खिलौना', 'मिट्टी का दीया'",
            idea_button: "डिज़ाइन बनाएं",
            upload_title: "२. छवि से लिस्टिंग बनाएं",
            upload_desc: "अपने तैयार शिल्प की एक तस्वीर अपलोड करें, उसका वर्णन करें, और हम आपके ऑनलाइन स्टोर के लिए सभी विवरण तैयार करेंगे।",
            upload_button: "अपनी छवि अपलोड करें",
            listing_from_upload_placeholder: "अपने उत्पाद का संक्षिप्त विवरण दें। जैसे, 'मधुबनी कला के साथ हाथ से पेंट किए गए लकड़ी के कोस्टर, 4 का सेट।'",
            results_title: "बनाए गए डिज़ाइन",
            results_desc: "अगले चरणों के लिए इसे चुनने के लिए एक छवि पर क्लिक करें।",
            angle_title: "अलग-अलग एंगल बनाएं",
            angle_desc: "आइए आपके चुने हुए डिज़ाइन के लिए अलग-अलग कैमरा एंगल से पेशेवर उत्पाद शॉट्स बनाएं।",
            angle_button: "४ एंगल बनाएं",
            edit_title: "अपना डिज़ाइन संपादित करें",
            edit_desc: "अपनी छवि को परिष्कृत करें। चयनित फ़ोटो में आप जो परिवर्तन करना चाहते हैं, उनका वर्णन करें।",
            edit_button: "संपादन लागू करें",
            material_title: "३. अपनी कला की योजना बनाएं और सामग्री प्राप्त करें",
            material_desc: "एक आधार छवि अपलोड करें, फिर आप जो अंतिम उत्पाद बनाना चाहते हैं उसका वर्णन करें। हमारा एआई आपकी ज़रूरत की सामग्रियों की एक सूची तैयार करेगा।",
            material_upload_button: "आधार छवि अपलोड करें",
            material_placeholder: "अंतिम उत्पाद का वर्णन करें। उदाहरण के लिए: 'मैं यह लकड़ी का खिलौना बनाना चाहता हूं...'",
            material_button: "सामग्री सूची प्राप्त करें",
            material_results_title: "सुझाई गई सामग्रियां",
            find_suppliers_button: "ऑनलाइन आपूर्तिकर्ता खोजें",
            suppliers_title: "ऑनलाइन आपूर्तिकर्ता",
            listing_button: "लिस्टिंग विवरण बनाएं",
        }
    };

    // --- DOM Elements ---
    const languageSwitch = document.getElementById('language-switch');
    const ideaForm = document.getElementById('idea-form');
    const ideaPromptInput = document.getElementById('idea-prompt-input');
    const uploadImageInput = document.getElementById('upload-image-input');
    const ideaGallerySection = document.getElementById('idea-gallery-section');
    const ideaGallery = document.getElementById('idea-gallery');
    const angleSection = document.getElementById('angle-section');
    const editSection = document.getElementById('edit-section');
    const selectedImageForAngles = document.getElementById('selected-image-for-angles');
    const generateAnglesBtn = document.getElementById('generate-angles-btn');
    const angleGallery = document.getElementById('angle-gallery');
    const selectedImageForEdit = document.getElementById('selected-image-for-edit');
    const editForm = document.getElementById('edit-form');
    const editPromptInput = document.getElementById('edit-prompt-input');
    const editGallery = document.getElementById('edit-gallery');
    const tipsLoader = document.getElementById('tips-loader');
    const tipText = document.getElementById('tip-text');
    const materialImageInput = document.getElementById('material-image-input');
    const materialImagePreview = document.getElementById('material-image-preview');
    const materialImagePreviewContainer = document.getElementById('material-image-preview-container');
    const materialForm = document.getElementById('material-form');
    const materialDescriptionInput = document.getElementById('material-description-input');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const materialResultsContainer = document.getElementById('material-results-container');
    const materialResultsList = document.getElementById('material-results-list');
    const findSuppliersBtn = document.getElementById('find-suppliers-btn');
    const supplierResultsContainer = document.getElementById('supplier-results-container');
    const supplierResultsList = document.getElementById('supplier-results-list');
    // New Listing Elements from Upload Section
    const uploadImagePreviewContainer = document.getElementById('upload-image-preview-container');
    const uploadImagePreview = document.getElementById('upload-image-preview');
    const listingFromUploadForm = document.getElementById('listing-from-upload-form');
    const listingDescriptionInput = document.getElementById('listing-description-input');
    const listingResultsContainer = document.getElementById('listing-results-container');


    // --- State Management ---
    let tipInterval;
    let materialImageB64 = null;
    let uploadedImageForListingB64 = null; // New state for the upload-listing flow
    let materialsCache = { en: null, hi: null };
    let isMaterialRequestActive = false;
    const artisanTips = {
        en: ["Photograph your work in natural light to capture true colors.", "Tell the story behind your craft. Buyers love connecting with the creator.", "Use social media to showcase your creative process, not just the final product."],
        hi: ["सच्चे रंगों को पकड़ने के लिए अपने काम की तस्वीर प्राकृतिक रोशनी में लें।", "अपनी कला के पीछे की कहानी बताएं। खरीदारों को निर्माता से जुड़ना पसंद है।", "सिर्फ अंतिम उत्पाद ही नहीं, अपनी रचनात्मक प्रक्रिया को प्रदर्शित करने के लिए सोशल मीडिया का उपयोग करें।"]
    };

    // --- Language Functions ---
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang][key]) elem.textContent = translations[lang][key];
        });
        document.querySelectorAll('[data-key-placeholder]').forEach(elem => {
            const key = elem.getAttribute('data-key-placeholder');
            if (translations[lang][key]) elem.placeholder = translations[lang][key];
        });
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        if (isMaterialRequestActive && materialsCache[lang]) {
            displayMaterials(materialsCache[lang]);
        }
    };
    languageSwitch.addEventListener('change', (e) => setLanguage(e.target.checked ? 'hi' : 'en'));
    const savedLang = localStorage.getItem('language') || 'en';
    languageSwitch.checked = savedLang === 'hi';
    setLanguage(savedLang);

    // --- Loader Functions ---
    const showTipsLoader = () => {
        const tips = artisanTips[localStorage.getItem('language') || 'en'];
        let tipIndex = Math.floor(Math.random() * tips.length);
        tipText.textContent = tips[tipIndex];
        tipsLoader.classList.remove('hidden');
        tipInterval = setInterval(() => {
            tipIndex = (tipIndex + 1) % tips.length;
            tipText.style.animation = 'none';
            setTimeout(() => {
                tipText.textContent = tips[tipIndex];
                tipText.style.animation = 'fadeIn 0.5s ease-in-out';
            }, 100);
        }, 3500);
    };
    const hideTipsLoader = () => {
        clearInterval(tipInterval);
        tipsLoader.classList.add('hidden');
    };

    // --- Core API Call Function ---
    const performApiCall = async (endpoint, body, resultContainer) => {
        showTipsLoader();
        if (resultContainer) resultContainer.innerHTML = '';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'An unknown error occurred');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error during API call to ${endpoint}:`, error);
            if (resultContainer) resultContainer.innerHTML = `<p class="error" style="text-align: center; color: red;">Error: ${error.message}</p>`;
            return null;
        } finally {
            hideTipsLoader();
        }
    };

    // --- Event Handlers ---
    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAllSections();
        const data = await performApiCall('/refine-and-generate-ideas', { prompt: ideaPromptInput.value }, ideaGallery);
        if (data && data.images) {
            displayImages(data.images, ideaGallery, true);
            ideaGallerySection.classList.remove('hidden');
        }
    });

    generateAnglesBtn.addEventListener('click', async () => {
        const imageB64 = selectedImageForAngles.dataset.b64;
        if (!imageB64) return;
        const data = await performApiCall('/generate-angles', { image_data: imageB64 }, angleGallery);
        if (data && data.images) displayImages(data.images, angleGallery, true);
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageB64 = selectedImageForEdit.dataset.b64;
        if (!imageB64) return;
        const data = await performApiCall('/edit-image', { image_data: imageB64, prompt: editPromptInput.value }, editGallery);
        if (data && data.image) displayImages([data.image], editGallery, true);
    });

    // UPDATED: This now handles the new Listing from Upload workflow
    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64StringWithData = reader.result;
            uploadedImageForListingB64 = base64StringWithData.replace('data:', '').replace(/^.+,/, '');
            uploadImagePreview.src = base64StringWithData;
            uploadImagePreviewContainer.classList.remove('hidden');
            listingFromUploadForm.classList.remove('hidden');
            listingResultsContainer.classList.add('hidden'); // Hide old results
        };
        reader.readAsDataURL(file);
    });
    
    // NEW: Event listener for the new form in the upload section
    listingFromUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!uploadedImageForListingB64 || !listingDescriptionInput.value) {
            alert('Please upload an image and provide a description.');
            return;
        }
        const body = {
            image_data: uploadedImageForListingB64,
            description: listingDescriptionInput.value
        };
        const listingData = await performApiCall('/generate-product-listing', body, listingResultsContainer);
        if (listingData) {
            displayListingInfo(listingData, listingResultsContainer);
        }
    });


    materialImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64StringWithData = reader.result;
            materialImageB64 = base64StringWithData.replace('data:', '').replace(/^.+,/, '');
            materialImagePreview.src = base64StringWithData;
            materialImagePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = localStorage.getItem('language') === 'hi' ? 'hi-IN' : 'en-US';
        voiceInputBtn.addEventListener('click', () => { voiceInputBtn.textContent = '🎙️'; recognition.start(); });
        recognition.onresult = (e) => { materialDescriptionInput.value += e.results[0][0].transcript + ' '; };
        recognition.onerror = (e) => { console.error('Speech recognition error:', e.error); voiceInputBtn.textContent = '🎤'; };
        recognition.onend = () => { voiceInputBtn.textContent = '🎤'; };
        languageSwitch.addEventListener('change', (e) => { recognition.lang = e.target.checked ? 'hi-IN' : 'en-US'; });
    } else {
        voiceInputBtn.classList.add('hidden');
    }

    materialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!materialImageB64 || !materialDescriptionInput.value) { alert('Please upload an image and provide a description.'); return; }
        findSuppliersBtn.classList.add('hidden');
        supplierResultsContainer.classList.add('hidden');
        const lang = localStorage.getItem('language') || 'en';
        const body = { image_data: materialImageB64, description: materialDescriptionInput.value };
        const data = await performApiCall('/get-materials-all-langs', body, materialResultsList);
        if (data && data.materials) {
            materialsCache.en = data.materials.en;
            materialsCache.hi = data.materials.hi;
            isMaterialRequestActive = true;
            displayMaterials(materialsCache[lang]);
        }
    });

    findSuppliersBtn.addEventListener('click', async () => {
        const materials = materialsCache[localStorage.getItem('language') || 'en'];
        if (!materials || materials.length === 0) return;
        const materialNames = materials.map(item => item.material);
        const supplierData = await performApiCall('/find-suppliers', { materials: materialNames }, supplierResultsList);
        if (supplierData) displaySuppliers(supplierData);
    });
    
    // --- UI Display Functions ---
    const displayMaterials = (materials) => {
        materialResultsList.innerHTML = '';
        if (!materials || materials.length === 0) { findSuppliersBtn.classList.add('hidden'); return; }
        const ul = document.createElement('ul');
        ul.className = 'materials-list';
        materials.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.material}</strong> (Qty: ${item.quantity})<br><em>${item.reason}</em>`;
            ul.appendChild(li);
        });
        materialResultsList.appendChild(ul);
        materialResultsContainer.classList.remove('hidden');
        findSuppliersBtn.classList.remove('hidden');
    };

    const displaySuppliers = (suppliers) => {
        supplierResultsList.innerHTML = '';
        if (!suppliers || suppliers.length === 0) return;
        const ul = document.createElement('ul');
        ul.className = 'suppliers-list';
        suppliers.forEach(item => {
            const li = document.createElement('li');
            const link = item.link && item.link.startsWith('http') ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.supplier}</a>` : `${item.supplier}`;
            li.innerHTML = `<strong>${item.material}</strong>: ${link}<br><em>${item.notes}</em>`;
            ul.appendChild(li);
        });
        supplierResultsList.appendChild(ul);
        supplierResultsContainer.classList.remove('hidden');
    };

    const displayListingInfo = (data, container) => {
        container.innerHTML = '';
        if (!data) return;
        const featuresHTML = '<ul>' + data.features.map(f => `<li>${f}</li>`).join('') + '</ul>';
        const keywordsHTML = `<p class="keywords-list"><strong>Keywords:</strong> ${data.keywords.join(', ')}</p>`;
        const tipsHTML = `
            <h4>Platform Tips</h4>
            <div class="platform-tips">
                <div><strong>Amazon Karigar:</strong><p>${data.platform_tips.amazon_karigar}</p></div>
                <div><strong>Flipkart Samarth:</strong><p>${data.platform_tips.flipkart_samarth}</p></div>
                <div><strong>ONDC:</strong><p>${data.platform_tips.ondc}</p></div>
            </div>`;
        container.innerHTML = `
            <h3>${data.title}</h3>
            <h4>The Story Behind the Craft</h4>
            <p>${data.story.replace(/\n/g, '<br>')}</p>
            <h4>Product Description</h4>
            <p>${data.description.replace(/\n/g, '<br>')}</p>
            <h4>Key Features</h4>
            ${featuresHTML}
            ${keywordsHTML}
            ${tipsHTML}`;
        container.classList.remove('hidden');
    };

    const displayImages = (images, galleryElement, allowSelection) => {
        galleryElement.innerHTML = '';
        images.forEach((base64Image) => {
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${base64Image}`;
            img.dataset.b64 = base64Image;
            galleryElement.appendChild(img);
            if (allowSelection) {
                img.addEventListener('click', () => handleImageSelection(base64Image, galleryElement, img));
            }
        });
    };

    const handleImageSelection = (base64, galleryElement, selectedImgElement = null) => {
        const imgSrc = `data:image/png;base64,${base64}`;
        selectedImageForAngles.src = imgSrc;
        selectedImageForAngles.dataset.b64 = base64;
        selectedImageForEdit.src = imgSrc;
        selectedImageForEdit.dataset.b64 = base64;
        
        if(galleryElement && selectedImgElement) {
            galleryElement.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
            selectedImgElement.classList.add('selected');
        }
        
        ideaGallerySection.classList.remove('hidden');
        angleSection.classList.remove('hidden');
        editSection.classList.remove('hidden');
        
        angleGallery.innerHTML = '';
        editGallery.innerHTML = '';
    };

    const hideAllSections = () => {
        ideaGallerySection.classList.add('hidden');
        angleSection.classList.add('hidden');
        editSection.classList.add('hidden');
    };
});

