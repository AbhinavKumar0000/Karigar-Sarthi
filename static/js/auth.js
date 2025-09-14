// IMPORTANT: Paste your Firebase config object here from Step 1.4
const firebaseConfig = {
  apiKey: "AIzaSyCPaL2Eoa8BsPqMC03jNfhnMijwG6-A42U",
  authDomain: "burnished-sweep-471303-v4.firebaseapp.com",
  projectId: "burnished-sweep-471303-v4",
  storageBucket: "burnished-sweep-471303-v4.appspot.com",
  messagingSenderId: "1042553463223",
  appId: "1:1042553463223:web:286c8a1528f901feed0832",
  measurementId: "G-CG7NRWFD81"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// --- DOM Elements ---
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authForm = document.getElementById('auth-form');
const errorMessage = document.getElementById('error-message');

// --- Helper Functions ---
const showAuthError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
};

const hideAuthError = () => {
    errorMessage.classList.remove('visible');
};

// --- Main Logic ---
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAuthError(); // Hide previous errors

        const email = emailInput.value;
        const password = passwordInput.value;
        const isSignUp = authForm.dataset.authMode === 'signup';

        try {
            if (isSignUp) {
                await auth.createUserWithEmailAndPassword(email, password);
            }
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                showAuthError(errorData.error || 'Backend login failed.');
            }

        } catch (error) {
            console.error("Authentication error:", error);
            showAuthError(error.message);
        }
    });
}

