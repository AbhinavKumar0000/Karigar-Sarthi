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
const getFriendlyAuthError = (error) => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/too-many-requests':
            return 'Access temporarily disabled due to too many login attempts. Please try again later.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
};

const showAuthError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
};

const hideAuthError = () => {
    errorMessage.classList.remove('visible');
    errorMessage.textContent = '';
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
            
            // Sign in is required for both login and after signup to get the token
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            
            // Send token to backend to create a session
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
            const friendlyMessage = getFriendlyAuthError(error);
            showAuthError(friendlyMessage);
        }
    });
}
