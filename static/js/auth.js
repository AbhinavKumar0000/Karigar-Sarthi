// IMPORTANT: Paste your Firebase config object here from Step 1.4
const firebaseConfig = {
  apiKey: "AIzaSyCPaL2Eoa8BsPqMC03jNfhnMijwG6-A42U",
  authDomain: "burnished-sweep-471303-v4.firebaseapp.com",
  projectId: "burnished-sweep-471303-v4",
  storageBucket: "burnished-sweep-471303-v4.firebasestorage.app",
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

// --- Main Logic ---

// Listen for form submission
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        const isSignUp = authForm.dataset.authMode === 'signup'; // Check if we are on the signup page

        try {
            if (isSignUp) {
                // Create a new user account
                await auth.createUserWithEmailAndPassword(email, password);
            }
            
            // Sign in the user (this runs for both signup and login)
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Get the ID Token for the backend
            const idToken = await user.getIdToken();
            
            // Send the token to our Flask backend to create a session
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: idToken }),
            });

            if (response.ok) {
                // If the backend session is created successfully, redirect to the main app
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.error || 'Backend login failed.';
            }

        } catch (error) {
            // Handle Firebase authentication errors
            console.error("Authentication error:", error);
            errorMessage.textContent = error.message;
        }
    });
}
