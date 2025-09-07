document.addEventListener('DOMContentLoaded', () => {
    // --- Translations ---
    const translations = {
        en: {
            main_title: "Karigar-Sarthi",
            subtitle: "Your AI-Powered Digital Workshop",
            lang_en: "EN",
            lang_hi: "HI",
            idea_title: "1. Create a New Idea",
            idea_desc: "Describe your concept, and our AI will generate four unique designs inspired by diverse Indian aesthetics.",
            idea_placeholder: "e.g., 'a wooden elephant toy', 'a terracotta Diya'",
            idea_button: "Generate Designs",
            upload_title: "2. Upload & Edit an Image",
            upload_desc: "Have a photo already? Upload it here to start editing or generate different angles.",
            upload_button: "Upload Your Image",
            results_title: "Generated Designs",
            results_desc: "Click an image to select it for the next steps.",
            angle_title: "Generate Different Angles",
            angle_desc: "Let's create professional product shots from different camera angles for your selected design.",
            angle_button: "Generate 4 Angles",
            edit_title: "Edit Your Design",
            edit_desc: "Refine your image. Describe the changes you want to make to the selected photo.",
            edit_placeholder: "e.g., 'make the background blue', 'add gold patterns'",
            edit_button: "Apply Edit"
        },
        hi: {
            main_title: "कारीगर-सारथी",
            subtitle: "आपकी एआई-संचालित डिजिटल कार्यशाला",
            lang_en: "EN",
            lang_hi: "HI",
            idea_title: "१. एक नया विचार बनाएं",
            idea_desc: "अपनी अवधारणा का वर्णन करें, और हमारा एआई विविध भारतीय सौंदर्यशास्त्र से प्रेरित चार अद्वितीय डिजाइन तैयार करेगा।",
            idea_placeholder: "उदा., 'लकड़ी का हाथी खिलौना', 'मिट्टी का दीया'",
            idea_button: "डिज़ाइन बनाएं",
            upload_title: "२. एक छवि अपलोड और संपादित करें",
            upload_desc: "क्या आपके पास पहले से कोई तस्वीर है? संपादन शुरू करने या अलग-अलग एंगल बनाने के लिए इसे यहां अपलोड करें।",
            upload_button: "अपनी छवि अपलोड करें",
            results_title: "बनाए गए डिज़ाइन",
            results_desc: "अगले चरणों के लिए इसे चुनने के लिए एक छवि पर क्लिक करें।",
            angle_title: "अलग-अलग एंगल बनाएं",
            angle_desc: "आइए आपके चुने हुए डिज़ाइन के लिए अलग-अलग कैमरा एंगल से पेशेवर उत्पाद शॉट्स बनाएं।",
            angle_button: "४ एंगल बनाएं",
            edit_title: "अपना डिज़ाइन संपादित करें",
            edit_desc: "अपनी छवि को परिष्कृत करें। चयनित फ़ोटो में आप जो परिवर्तन करना चाहते हैं, उनका वर्णन करें।",
            edit_placeholder: "उदा., 'पृष्ठभूमि को नीला बनाएं', 'सुनहरे पैटर्न जोड़ें'",
            edit_button: "संपादन लागू करें"
        }
    };

    // --- DOM Elements ---
    const languageSwitch = document.getElementById('language-switch');
    const ideaForm = document.getElementById('idea-form');
    const ideaPromptInput = document.getElementById('idea-prompt-input');
    const uploadImageInput = document.getElementById('upload-image-input');
    const resultsContainer = document.getElementById('results-container');
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

    // --- State Management ---
    let tipInterval;

    // --- Tips for Artisans ---
    const artisanTips = {
        en: [
            "Photograph your work in natural light to capture true colors.",
            "Tell the story behind your craft. Buyers love connecting with the creator.",
            "Collaborate with other local artisans to reach a wider audience.",
            "Use social media to showcase your creative process, not just the final product.",
            "Price your work based on material cost, time, and your unique skill.",
            "Clearly define your art style. It helps build a recognizable brand.",
            "Don't be afraid to experiment with new materials and techniques.",
            "Package your products beautifully. A great unboxing experience leads to repeat customers.",
            "Engage with your followers. Ask them what they'd like to see you create next.",
            "Visit local markets and fairs to understand what customers are looking for."
        ],
        hi: [
            "सच्चे रंगों को पकड़ने के लिए अपने काम की तस्वीर प्राकृतिक रोशनी में लें।",
            "अपनी कला के पीछे की कहानी बताएं। खरीदारों को निर्माता से जुड़ना पसंद है।",
            "व्यापक दर्शकों तक पहुंचने के लिए अन्य स्थानीय कारीगरों के साथ सहयोग करें।",
            "सिर्फ अंतिम उत्पाद ही नहीं, अपनी रचनात्मक प्रक्रिया को प्रदर्शित करने के लिए सोशल मीडिया का उपयोग करें।",
            "अपने काम का मूल्य सामग्री लागत, समय और अपने अद्वितीय कौशल के आधार पर तय करें।",
            "अपनी कला शैली को स्पष्ट रूप से परिभाषित करें। यह एक पहचानने योग्य ब्रांड बनाने में मदद करता है।",
            "नई सामग्रियों और तकनीकों के साथ प्रयोग करने से न डरें।",
            "अपने उत्पादों को खूबसूरती से पैकेज करें। एक शानदार अनबॉक्सिंग अनुभव बार-बार ग्राहक लाता है।",
            "अपने अनुयायियों के साथ जुड़ें। उनसे पूछें कि वे आपको आगे क्या बनाते हुए देखना चाहेंगे।",
            "ग्राहक क्या ढूंढ रहे हैं, यह समझने के लिए स्थानीय बाजारों और मेलों का दौरा करें।"
        ]
    };

    // --- Language Functions ---
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang][key]) {
                elem.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-key-placeholder]').forEach(elem => {
            const key = elem.getAttribute('data-key-placeholder');
            if (translations[lang][key]) {
                elem.placeholder = translations[lang][key];
            }
        });
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    };

    languageSwitch.addEventListener('change', (e) => {
        setLanguage(e.target.checked ? 'hi' : 'en');
    });

    const savedLang = localStorage.getItem('language') || 'en';
    languageSwitch.checked = savedLang === 'hi';
    setLanguage(savedLang);

    // --- Loader Functions ---
    const showTipsLoader = () => {
        const currentLang = localStorage.getItem('language') || 'en';
        const tips = artisanTips[currentLang];
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
    const performApiCall = async (endpoint, body, galleryElement) => {
        showTipsLoader();
        galleryElement.innerHTML = '';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'An unknown error occurred');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error during API call to ${endpoint}:`, error);
            galleryElement.innerHTML = `<p class="error" style="text-align: center; color: red;">Error: ${error.message}</p>`;
            return null;
        } finally {
            hideTipsLoader();
        }
    };

    // --- Event Handlers ---
    ideaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAllSections();
        const prompt = ideaPromptInput.value;
        const data = await performApiCall('/refine-and-generate-ideas', { prompt }, ideaGallery);
        
        if (data && data.images) {
            displayImages(data.images, ideaGallery, true);
            ideaGallerySection.classList.remove('hidden');
        }
    });

    generateAnglesBtn.addEventListener('click', async () => {
        const imageB64 = selectedImageForAngles.dataset.b64;
        if (!imageB64) return;
        const data = await performApiCall('/generate-angles', { image_data: imageB64 }, angleGallery);

        if (data && data.images) {
            displayImages(data.images, angleGallery, true);
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const imageB64 = selectedImageForEdit.dataset.b64;
        if (!imageB64) return;
        const prompt = editPromptInput.value;
        const data = await performApiCall('/edit-image', { image_data: imageB64, prompt }, editGallery);

        if (data && data.image) {
            displayImages([data.image], editGallery, true);
        }
    });

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
            handleImageSelection(base64String, null);
            editPromptInput.value = '';
            editGallery.innerHTML = '';
        };
        reader.readAsDataURL(file);
    });

    // --- UI Helper Functions ---
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
        selectedImageForAngles.src = `data:image/png;base64,${base64}`;
        selectedImageForAngles.dataset.b64 = base64;
        selectedImageForEdit.src = `data:image/png;base64,${base64}`;
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
    }
});

