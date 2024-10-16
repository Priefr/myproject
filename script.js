import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import{getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence,onAuthStateChanged,browserLocalPersistence,setPersistence }from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import{getFirestore, setDoc , doc ,getDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlR3I8bb5WCk9tLkSLXq_903LO_GmcFos",
    authDomain: "recipefinder-4bf74.firebaseapp.com",
    databaseURL: "https://recipefinder-4bf74-default-rtdb.firebaseio.com",
    projectId: "recipefinder-4bf74",
    storageBucket: "recipefinder-4bf74.appspot.com",
    messagingSenderId: "748268639671",
    appId: "1:748268639671:web:392fa0ca7e3473820dc432",
    measurementId: "G-RGHD7GELMQ"
  };


// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get Firebase Auth instance

// Set persistence to LOCAL (Keeps the user logged in even after the browser is closed)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to LOCAL");
        // The user can now be signed in as usual
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });

// Listen for auth state changes to determine if a user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
        updateUIForLoggedInUser(user); // Implement this function to show user-specific data/UI
    } else {
        console.log('No user is logged in');
        updateUIForLoggedOutUser(); // Implement this function to show login UI, etc.
    }
});

function updateUIForLoggedInUser(user) {
    document.getElementById('login-btn').style.display = 'none'; // Hide the login button
    document.getElementById('logout-btn').style.display = 'block'; // Show the logout button
    document.getElementById('user-menu').style.display = 'block'; // Show user-specific menu
    document.getElementById('admin-menu').style.display = user.role === 'admin' ? 'block' : 'none'; // Show admin menu if user is an admin
}

function updateUIForLoggedOutUser() {
    document.getElementById('login-btn').style.display = 'block'; // Show the login button
    document.getElementById('logout-btn').style.display = 'none'; // Hide the logout button
    document.getElementById('user-menu').style.display = 'none'; // Hide user-specific menu
    document.getElementById('admin-menu').style.display = 'none'; // Hide admin menu
}



   // Open the nav by expanding its width
   document.getElementById('open-Nav').addEventListener('click', openNav);
   function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  document.getElementById('close-nav').addEventListener('click', closeNav);

  // Close the nav by collapsing its width
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }  
  


const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
document.getElementById('meal').classList.add('loaded');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    const mealDetails = document.querySelector('.meal-details');
    if (mealDetails) {
        mealDetails.style.display = 'none';
        mealDetails.classList.remove('showRecipe'); 
    }
}); 



// Get meal list from the database
function getMealList() {

    fetch(`http://localhost:3000/meals`) // Fetch from your server
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.length > 0) {
                data.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.id}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.name}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching meals:', error);
            mealList.innerHTML = "Error fetching meals.";
            mealList.classList.add('notFound');
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`http://localhost:3000/meals/${mealItem.dataset.id}`) // Endpoint for specific meal details (to be created)
            .then(response => response.json())
            .then(data => showRecipeDetails(data));
    }
}

function showRecipeDetails(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    const ingredientList = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');

    const mealDetailsContent = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Ingredients:</h3>
            <ol>${ingredientList}</ol>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;

    document.querySelector('.meal-details-content').innerHTML = mealDetailsContent;
    document.querySelector('.meal-details').style.display = 'block';
}
// Initialize Firebase (replace with your config)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Get the modal and login button elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('login-btn');
const closeBtnLogin = document.querySelector('.close'); // For closing the login modal
const closeBtnSignup = document.querySelectorAll('.close')[1]; // Assuming the second close button is for signup

// Open login modal when login button is clicked
loginBtn.addEventListener('click', () => {
    openLoginModal();
});

function openLoginModal() {
    loginModal.style.display = 'block';
}

// Close login modal function
document.getElementById('close').addEventListener('click', closeLoginModal);

// Close login modal
function closeLoginModal () {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'none';
}





// Open signup modal
document.getElementById('showSignupModal').addEventListener('click', () => {
    closeLoginModal ()
    openSignupModal();
});

function openSignupModal() {
    signupModal.style.display = 'block';
}

// Close signup modal function

document.getElementById('closesignup').addEventListener('click',closeSignupModal ) 

function closeSignupModal() {
    signupModal.style.display = 'none';
}

// Close signup modal when 'x' is clicked

// Close the modals if the user clicks outside of them
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
});

// Handle the signup process
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('email').value;
    const role = document.querySelector('input[name="role"]:checked').value; // Get the selected role

    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                username: username,
                email: email,
                role: role // Store the user's role
            };
            console.log('User registered:', user);

            // Store user details in Firestore
            setDoc(doc(db, "users", user.uid), userData)
                .then(() => {
                    console.log("User data saved to Firestore");
                    window.location.href = 'index.html'; // Redirect after successful signup
                })
                .catch((error) => {
                    console.error("Error writing document to Firestore:", error);
                });

            closeSignupModal(); // Close signup modal
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email already exists', 'signUpMessage'); 
            } else {
                console.error('Error:', error.message);
            }
        });
});
// Handle the login process
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();
    const db = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User logged in:', user);

            // Fetch the user data from Firestore
            const userDoc = doc(db, "users", user.uid);

            getDoc(userDoc)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const role = userData.role; // Fetch the role

                        console.log('User role:', role);

                        // Close login modal
                        closeLoginModal();

                        // Update sidebar based on role
                        updateSidebar(role);

                        // Show logout button, hide login button
                        document.getElementById('login-btn').style.display = 'none';
                        document.getElementById('logout-btn').style.display = 'block';
                    } else {
                        console.log('No such document in Firestore!');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        })
        .catch((error) => {
            console.error('Login error:', error.message);
        });
});
function showMessage(message, elementId) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
    }
}

// Update sidebar based on role
function updateSidebar(role) {
    const adminMenu = document.getElementById('admin-menu');
    const userMenu = document.getElementById('user-menu');
    const defaultMenu = document.getElementById('default-menu');

    // Hide default menu
    defaultMenu.style.display = 'none';

    if (role === 'admin') {
        adminMenu.style.display = 'block'; // Show admin menu
        userMenu.style.display = 'none'; // Hide user menu
    } else if (role === 'user') {
        adminMenu.style.display = 'none'; // Hide admin menu
        userMenu.style.display = 'block'; // Show user menu
    }
}
document.getElementById('logout-btn').addEventListener('click', () => {
    const auth = getAuth();
    auth.signOut()
        .then(() => {
            console.log('User signed out successfully');
            updateUIForLoggedOutUser(); // Update the UI for logged-out state
        })
        .catch((error) => {
            console.error('Error signing out:', error.message);
        });
});




