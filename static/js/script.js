document.addEventListener('DOMContentLoaded', () => {
    // --- Translations ---
    const translations = {
        en: {
            main_title: "Karigar Sarthi",
            subtitle: "Your AI Powered Digital Workshop",
            lang_en: "EN", lang_hi: "HI",
            input_title: "Describe Your Craft",
            input_image_title: "Provide an Image",
            upload_button: "Upload from Gallery",
            camera_button: "Use Camera",
            input_desc_title: "Describe the Product",
            input_desc_placeholder: "Describe your product or the changes you want to make...",
            material_button: "Get Materials & Pricing",
            listing_button: "Generate Listing",
            material_results_title: "Materials & Pricing Strategy",
            listing_results_title: "Generated Product Listing",
            find_suppliers_button: "Find Online Suppliers",
            suppliers_title: "Online Suppliers",
            idea_title: "AI Design Studio",
            idea_desc: "Don't have an idea? Describe a concept, and our AI will generate four unique designs for you.",
            idea_placeholder: "e.g., 'a wooden elephant toy'",
            idea_button: "Generate Designs",
            results_title: "Generated Designs",
            results_desc: "Click an image to select it or use it as a base for material planning.",
            angle_title: "Generate Different Angles",
            angle_button: "Generate 4 Angles",
            edit_title: "Edit Your Design",
            edit_placeholder: "e.g., 'make the background blue'",
            edit_button: "Apply Edit",
            price_strat_title: "Pricing Strategy",
            cost_breakdown_title: "Production Cost Breakdown",
            total_materials: "Total Material Cost",
            overhead: "Overhead/Contingency",
            cost_to_make: "Total Cost to Make (per batch)",
            units_per_batch: "Units per Batch",
            cost_per_piece: "Cost per Piece",
            pricing_rec_title: "Pricing Recommendations",
            wholesale_price: "Suggested Wholesale Price",
            retail_price: "Suggested Retail Price",
            listing_story_title: "The Story Behind the Craft",
            listing_desc_title: "Product Description",
            listing_features_title: "Key Features",
            listing_keywords_title: "Keywords",
            listing_tips_title: "Platform Tips",
        },
        hi: {
            main_title: "कारीगर सारथी",
            subtitle: "आपकी एआई संचालित डिजिटल कार्यशाला",
            lang_en: "EN", lang_hi: "HI",
            input_title: "यहां से शुरू करें: अपनी कला का वर्णन करें",
            input_image_title: "१. एक छवि प्रदान करें",
            upload_button: "गैलरी से अपलोड करें",
            camera_button: "कैमरे का प्रयोग करें",
            input_desc_title: "२. उत्पाद का वर्णन करें",
            input_desc_placeholder: "अपने उत्पाद या उन परिवर्तनों का वर्णन करें जो आप करना चाहते हैं...",
            material_button: "सामग्री और मूल्य निर्धारण प्राप्त करें",
            listing_button: "लिस्टिंग बनाएं",
            material_results_title: "सामग्री और मूल्य निर्धारण रणनीति",
            listing_results_title: "उत्पाद लिस्टिंग",
            find_suppliers_button: "ऑनलाइन आपूर्तिकर्ता खोजें",
            suppliers_title: "ऑनलाइन आपूर्तिकर्ता",
            idea_title: "वैकल्पिक: एआई डिजाइन स्टूडियो",
            idea_desc: "कोई विचार नहीं है? एक अवधारणा का वर्णन करें, और हमारा एआई आपके लिए चार अद्वितीय डिजाइन तैयार करेगा।",
            idea_placeholder: "उदा., 'लकड़ी का हाथी खिलौना'",
            idea_button: "डिज़ाइन बनाएं",
            results_title: "बनाए गए डिज़ाइन",
            results_desc: "इसे चुनने के लिए एक छवि पर क्लिक करें या सामग्री योजना के लिए आधार के रूप में इसका उपयोग करें।",
            angle_title: "अलग-अलग एंगल बनाएं",
            angle_button: "४ एंगल बनाएं",
            edit_title: "अपना डिज़ाइन संपादित करें",
            edit_placeholder: "उदा., 'पृष्ठभूमि को नीला बनाएं'",
            edit_button: "संपादन लागू करें",
            price_strat_title: "मूल्य निर्धारण रणनीति",
            cost_breakdown_title: "उत्पादन लागत का विवरण",
            total_materials: "कुल सामग्री लागत",
            overhead: "ओवरहेड/आकस्मिकता",
            cost_to_make: "बनाने की कुल लागत (प्रति बैच)",
            units_per_batch: "प्रति बैच इकाइयाँ",
            cost_per_piece: "प्रति पीस लागत",
            pricing_rec_title: "मूल्य निर्धारण सिफारिशें",
            wholesale_price: "सुझाया गया थोक मूल्य",
            retail_price: "सुझाया गया खुदरा मूल्य",
            listing_story_title: "शिल्प के पीछे की कहानी",
            listing_desc_title: "उत्पाद विवरण",
            listing_features_title: "मुख्य विशेषताएं",
            listing_keywords_title: "कीवर्ड",
            listing_tips_title: "प्लेटफ़ॉर्म युक्तियाँ",
        }
    };

    // --- DOM Elements ---
    const languageSwitch = document.getElementById('language-switch');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const uploadInput = document.getElementById('upload-input');
    const cameraBtn = document.getElementById('camera-btn');
    const descriptionInput = document.getElementById('description-input');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const getMaterialsBtn = document.getElementById('get-materials-btn');
    const getListingBtn = document.getElementById('get-listing-btn');
    const resultsWrapper = document.getElementById('results-wrapper');
    const materialsResultsContainer = document.getElementById('materials-results-container');
    const materialsList = document.getElementById('materials-list');
    const pricingSummaryContainer = document.getElementById('pricing-summary-container');
    const findSuppliersBtn = document.getElementById('find-suppliers-btn');
    const supplierResultsContainer = document.getElementById('supplier-results-container');
    const supplierResultsList = document.getElementById('supplier-results-list');
    const listingResultsContainer = document.getElementById('listing-results-container');
    const aiStudioSection = document.getElementById('ai-studio-section');
    const ideaForm = document.getElementById('idea-form');
    const ideaPromptInput = document.getElementById('idea-prompt-input');
    const ideaResultsContainer = document.getElementById('results-container');
    const ideaGallerySection = document.getElementById('idea-gallery-section');
    const ideaGallery = document.getElementById('idea-gallery');
    const angleSection = document.getElementById('angle-section');
    const selectedImageForAngles = document.getElementById('selected-image-for-angles');
    const generateAnglesBtn = document.getElementById('generate-angles-btn');
    const angleGallery = document.getElementById('angle-gallery');
    const editSection = document.getElementById('edit-section');
    const selectedImageForEdit = document.getElementById('selected-image-for-edit');
    const editForm = document.getElementById('edit-form');
    const editPromptInput = document.getElementById('edit-prompt-input');
    const editGallery = document.getElementById('edit-gallery');
    const cameraModal = document.getElementById('camera-modal');
    const cameraFeed = document.getElementById('camera-feed');
    const cameraCanvas = document.getElementById('camera-canvas');
    const captureBtn = document.getElementById('capture-btn');
    const cancelCaptureBtn = document.getElementById('cancel-capture-btn');
    const tipsLoader = document.getElementById('tips-loader');
    const tipText = document.getElementById('tip-text');
    
    // --- State Management ---
    let tipInterval;
    let mainImageB64 = null;
    let materialsCache = { en: null, hi: null };
    let suppliersCache = { en: null, hi: null };
    let listingCache = { en: null, hi: null };
    
    const artisanTips = {
        en: ["Photograph your work in natural light to capture true colors.","Tell the story behind your craft. Buyers love connecting with the creator.","Use social media to showcase your creative process, not just the final product.","Collaborate with other local businesses for cross-promotion.", "Offer workshops or classes to share your skills.","Participate in local craft fairs, markets, and festivals.","Create a professional website with an online store.","Build an email list to announce new products and special offers.","Develop a strong brand identity, including a memorable logo and packaging.","Ask for customer reviews and testimonials to build credibility."],
        hi: ["सच्चे रंगों को दर्शाने के लिए अपने काम की तस्वीरें प्राकृतिक रोशनी में लें।","अपनी कला के पीछे की कहानी बताएं। खरीदारों को निर्माता से जुड़ना पसंद होता है।","सिर्फ अंतिम उत्पाद ही नहीं, बल्कि अपनी रचनात्मक प्रक्रिया को दिखाने के लिए सोशल मीडिया का उपयोग करें।","एक-दूसरे के प्रचार के लिए अन्य स्थानीय व्यवसायों के साथ सहयोग करें।","अपने कौशल को साझा करने के लिए कार्यशालाएं या कक्षाएं आयोजित करें।","स्थानीय शिल्प मेलों, बाजारों और त्योहारों में भाग लें।","एक ऑनलाइन स्टोर के साथ एक पेशेवर वेबसाइट बनाएं।","नए उत्पादों और विशेष प्रस्तावों की घोषणा के लिए एक ईमेल सूची बनाएं।","एक यादगार लोगो और पैकेजिंग सहित एक मजबूत ब्रांड पहचान विकसित करें।","विश्वसनीयता बनाने के लिए ग्राहकों से समीक्षाएं और प्रशंसापत्र मांगें।"],
    };

    // --- Language Functions ---
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) elem.textContent = translations[lang][key];
        });
        document.querySelectorAll('[data-key-placeholder]').forEach(elem => {
            const key = elem.getAttribute('data-key-placeholder');
            if (translations[lang] && translations[lang][key]) elem.placeholder = translations[lang][key];
        });
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        // Re-render dynamic content if it exists
        if (materialsCache.en && materialsCache[lang]) {
            displayMaterials(materialsCache[lang].materials);
            displayPricingSummary(materialsCache[lang].pricing, lang);
        }
        if (suppliersCache.en && suppliersCache[lang]) {
            displaySuppliers(suppliersCache[lang]);
        }
        if (listingCache.en && listingCache[lang]) {
            displayListingInfo(listingCache[lang], listingResultsContainer, lang);
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
                tipText.style.animation = 'fadeIn 1s ease-in-out';
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

    // --- Input Validation & Button State ---
    const checkInputsAndToggleButtonState = () => {
        const hasImage = mainImageB64 !== null;
        const hasDescription = descriptionInput.value.trim() !== '';
        const canProceed = hasImage && hasDescription;
        
        getMaterialsBtn.disabled = !canProceed;
        getListingBtn.disabled = !canProceed;
    };

    // --- Image Handling ---
    const handleImageFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64StringWithData = reader.result;
            const base64 = base64StringWithData.replace('data:', '').replace(/^.+,/, '');
            mainImageB64 = base64; // Set for main workflow
            imagePreview.src = base64StringWithData;
            imagePreviewContainer.classList.remove('hidden');
            checkInputsAndToggleButtonState();
            
            // Also set for AI Studio workflow
            setupImageForEditing(base64);
        };
        reader.readAsDataURL(file);
    };

    uploadInput.addEventListener('change', (e) => handleImageFile(e.target.files[0]));
    descriptionInput.addEventListener('input', checkInputsAndToggleButtonState);

// --- Camera Functionality ---
cameraBtn.addEventListener('click', async () => {
    cameraModal.classList.remove('hidden');

    // Define constraints to request the REAR camera
    const constraints = {
        video: {
            facingMode: { exact: "environment" } // 'environment' = rear camera
        }
    };

    try {
        // First, try to get the rear camera using the constraints
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraFeed.srcObject = stream;
    } catch (err) {
        console.error("Rear camera not found or failed, trying default camera:", err);
        // If the rear camera isn't available, fall back to any camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
        } catch (fallbackErr) {
            console.error("Error accessing any camera:", fallbackErr);
            alert("Could not access camera. Please check permissions.");
            cameraModal.classList.add('hidden');
        }
    }
});

captureBtn.addEventListener('click', () => {
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    const context = cameraCanvas.getContext('2d');
    context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);
    const dataUrl = cameraCanvas.toDataURL('image/png');
    const base64 = dataUrl.replace('data:', '').replace(/^.+,/, '');

    mainImageB64 = base64; // Set for main workflow
    imagePreview.src = dataUrl;
    imagePreviewContainer.classList.remove('hidden');
    closeCamera();
    checkInputsAndToggleButtonState();

    // Also set for AI Studio workflow
    setupImageForEditing(base64);
});

const closeCamera = () => {
    const stream = cameraFeed.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    cameraModal.classList.add('hidden');
};
cancelCaptureBtn.addEventListener('click', closeCamera);

    // --- Speech Recognition ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        const updateLang = () => recognition.lang = localStorage.getItem('language') === 'hi' ? 'hi-IN' : 'en-US';
        updateLang();
        
        voiceInputBtn.addEventListener('click', () => {
            voiceInputBtn.classList.add('active');
            recognition.start();
        });
        recognition.onresult = (e) => {
            descriptionInput.value += e.results[0][0].transcript + ' ';
            checkInputsAndToggleButtonState();
        };
        recognition.onerror = (e) => { console.error('Speech recognition error:', e.error); };
        recognition.onend = () => { voiceInputBtn.classList.remove('active'); };
        languageSwitch.addEventListener('change', updateLang);
    } else {
        voiceInputBtn.classList.add('hidden');
    }

    // --- Main Workflow Actions ---
    const resetResults = () => {
        resultsWrapper.classList.add('hidden');
        materialsResultsContainer.classList.add('hidden');
        listingResultsContainer.classList.add('hidden');
        supplierResultsContainer.classList.add('hidden');
        findSuppliersBtn.classList.add('hidden');
        materialsCache = { en: null, hi: null };
        suppliersCache = { en: null, hi: null };
        listingCache = { en: null, hi: null };
    };

    getMaterialsBtn.addEventListener('click', async () => {
        resetResults();
        const body = { image_data: mainImageB64, description: descriptionInput.value };
        const data = await performApiCall('/get-materials-all-langs', body, materialsList);
        
        if (data && data.materials) {
            materialsCache.en = data.materials.en;
            materialsCache.hi = data.materials.hi;
            const lang = localStorage.getItem('language') || 'en';
            displayMaterials(materialsCache[lang].materials);
            displayPricingSummary(materialsCache[lang].pricing, lang);
            resultsWrapper.classList.remove('hidden');
            materialsResultsContainer.classList.remove('hidden');
        }
    });

    getListingBtn.addEventListener('click', async () => {
        resetResults();
        const body = { image_data: mainImageB64, description: descriptionInput.value };
        const data = await performApiCall('/generate-product-listing', body, listingResultsContainer);
        if (data && data.listing) {
            listingCache.en = data.listing.en;
            listingCache.hi = data.listing.hi;
            const lang = localStorage.getItem('language') || 'en';
            displayListingInfo(listingCache[lang], listingResultsContainer, lang);
            resultsWrapper.classList.remove('hidden');
            listingResultsContainer.classList.remove('hidden');
        }
    });
    
    findSuppliersBtn.addEventListener('click', async () => {
        const lang = localStorage.getItem('language') || 'en';
        const materials = materialsCache[lang]?.materials;
        if (!materials || materials.length === 0) return;
        const materialNames = materials.map(item => item.material);

        suppliersCache = { en: null, hi: null }; // Reset before new call

        const data = await performApiCall('/find-suppliers', { materials: materialNames }, supplierResultsList);
        if (data && data.suppliers) {
            suppliersCache.en = data.suppliers.en;
            suppliersCache.hi = data.suppliers.hi;
            displaySuppliers(suppliersCache[lang]);
        }
    });

    // --- AI Studio ---
    aiStudioSection.querySelector('.collapsible-header').addEventListener('click', () => {
        aiStudioSection.classList.toggle('active');
    });

    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAllStudioSections();
        const data = await performApiCall('/refine-and-generate-ideas', { prompt: ideaPromptInput.value }, ideaGallery);
        if (data && data.images) {
            displayImages(data.images, ideaGallery, true);
            ideaResultsContainer.classList.remove('hidden');
            ideaGallerySection.classList.remove('hidden');
        }
    });

    generateAnglesBtn.addEventListener('click', async () => {
        const imageB64 = selectedImageForAngles.dataset.b64;
        if (!imageB64) return;
        const data = await performApiCall('/generate-angles', { image_data: imageB64 }, angleGallery);
        if (data && data.images) displayImages(data.images, angleGallery, false); // Changed to false
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageB64 = selectedImageForEdit.dataset.b64;
        if (!imageB64) return;
        const data = await performApiCall('/edit-image', { image_data: imageB64, prompt: editPromptInput.value }, editGallery);
        if (data && data.image) displayImages([data.image], editGallery, false); // Changed to false
    });

    const hideAllStudioSections = () => {
        ideaGallerySection.classList.add('hidden');
        angleSection.classList.add('hidden');
        editSection.classList.add('hidden');
    };

    // --- UI Display Functions ---
    // NEW HELPER FUNCTION to set up an image for editing in the AI Studio
    const setupImageForEditing = (base64) => {
        const imgSrc = `data:image/png;base64,${base64}`;

        // Set images for AI studio sections
        selectedImageForAngles.src = imgSrc;
        selectedImageForAngles.dataset.b64 = base64;
        selectedImageForEdit.src = imgSrc;
        selectedImageForEdit.dataset.b64 = base64;

        // Make the parent container for galleries visible
        ideaResultsContainer.classList.remove('hidden');
        
        // Show the specific studio sections for angles and edits
        angleSection.classList.remove('hidden');
        editSection.classList.remove('hidden');

        // Automatically expand the AI Design Studio collapsible section
        if (!aiStudioSection.classList.contains('active')) {
            aiStudioSection.classList.add('active');
        }

        // Clear any previous results from these sections
        angleGallery.innerHTML = '';
        editGallery.innerHTML = '';

        // Clear any 'selected' state from the main idea gallery
        ideaGallery.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
    };

    const displayMaterials = (materials) => {
        materialsList.innerHTML = '';
        if (!materials || materials.length === 0) {
            findSuppliersBtn.classList.add('hidden');
            return;
        }
        const ul = document.createElement('ul');
        ul.className = 'materials-list';
        materials.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="material-info">
                    <strong>${item.material}</strong> (Qty: ${item.quantity})
                    <em>${item.reason}</em>
                </div>
                <div class="material-cost">₹${item.estimated_cost_inr}</div>
            `;
            ul.appendChild(li);
        });
        materialsList.appendChild(ul);
        findSuppliersBtn.classList.remove('hidden');
    };
    
    const displayPricingSummary = (pricing, lang) => {
        pricingSummaryContainer.innerHTML = '';
        if (!pricing) return;
        const text = translations[lang];

        pricingSummaryContainer.innerHTML = `
            <h3 class="pricing-header" data-key="price_strat_title">${text.price_strat_title}</h3>
            <div class="pricing-section">
                <h4 class="pricing-subheader" data-key="cost_breakdown_title">${text.cost_breakdown_title}</h4>
                <div class="pricing-row">
                    <span data-key="total_materials">${text.total_materials}</span>
                    <span class="price-value">₹${pricing.total_material_cost || 0}</span>
                </div>
                <div class="pricing-row-light">
                    <span data-key="overhead">${text.overhead}</span>
                    <span class="price-value">${pricing.overhead_contingency_percent || 0}%</span>
                </div>
                <div class="pricing-row total-row">
                    <strong data-key="cost_to_make">${text.cost_to_make}</strong>
                    <strong class="price-value strong">₹${pricing.cost_to_make || 0}</strong>
                </div>
                <div class="pricing-row-light">
                    <span data-key="units_per_batch">${text.units_per_batch}</span>
                    <span class="price-value">${pricing.units_per_batch || 1}</span>
                </div>
                <div class="pricing-row">
                    <strong data-key="cost_per_piece">${text.cost_per_piece}</strong>
                    <strong class="price-value strong">₹${pricing.cost_per_piece_inr || 0}</strong>
                </div>
            </div>
            <div class="pricing-section">
                <h4 class="pricing-subheader" data-key="pricing_rec_title">${text.pricing_rec_title}</h4>
                <div class="pricing-row">
                    <span data-key="wholesale_price">${text.wholesale_price}</span>
                    <span class="price-value wholesale">₹${pricing.suggested_wholesale_price_inr || 0}</span>
                </div>
                <div class="pricing-row">
                    <span data-key="retail_price">${text.retail_price}</span>
                    <span class="price-value retail">₹${(pricing.suggested_retail_price_range_inr || [0,0]).join(' - ₹')}</span>
                </div>
            </div>
        `;
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

    const displayListingInfo = (data, container, lang) => {
        container.innerHTML = '';
        if (!data) {
            container.innerHTML = '<p class="error">Error: Could not generate listing data.</p>';
            return;
        }
        const text = translations[lang];
        
        const featuresHTML = '<ul>' + (data.features || []).map(f => `<li>${f}</li>`).join('') + '</ul>';
        const keywordsHTML = `<p class="keywords-list"><strong>${text.listing_keywords_title}:</strong> ${(data.keywords || []).join(', ')}</p>`;
        const tips = data.platform_tips || {};
        const tipsHTML = `
            <h4>${text.listing_tips_title}</h4>
            <div class="platform-tips">
                <div><strong>Amazon Karigar:</strong><p>${tips.amazon_karigar || ''}</p></div>
                <div><strong>Flipkart Samarth:</strong><p>${tips.flipkart_samarth || ''}</p></div>
                <div><strong>ONDC:</strong><p>${tips.ondc || ''}</p></div>
            </div>`;
            
        container.innerHTML = `
            <h3>${data.title || ''}</h3>
            <h4 data-key="listing_story_title">${text.listing_story_title}</h4>
            <p>${(data.story || '').replace(/\n/g, '<br>')}</p>
            <h4 data-key="listing_desc_title">${text.listing_desc_title}</h4>
            <p>${(data.description || '').replace(/\n/g, '<br>')}</p>
            <h4 data-key="listing_features_title">${text.listing_features_title}</h4>
            ${featuresHTML}
            ${keywordsHTML}
            ${tipsHTML}`;
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
        // Option 1: Set as main image for primary workflow
        mainImageB64 = base64;
        imagePreview.src = `data:image/png;base64,${base64}`;
        imagePreviewContainer.classList.remove('hidden');
        checkInputsAndToggleButtonState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    
        // Option 2: Use the new helper to set up the image for AI studio functions
        setupImageForEditing(base64);
        
        // If an image in a gallery was clicked, highlight it
        if(galleryElement && selectedImgElement) {
            galleryElement.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
            selectedImgElement.classList.add('selected');
        }
    };
});
