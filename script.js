import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    browserSessionPersistence,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    query, where,
    getFirestore,
    setDoc,
    getDocs,
    addDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    updateDoc,
    collection,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Initialize Analytics if needed
const analytics = getAnalytics(app);

// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });

let userRole = null; // Global variable to hold the user role



function showPopup(message, duration = 3000) { // Duration in milliseconds
    const popup = document.getElementById('popup-modal');
    const popupMessage = document.getElementById('popup-message');
    
    // Set the message text
    popupMessage.innerText = message; 
    popup.style.display = 'block'; // Show the modal

    // Hide the modal after the specified duration
    setTimeout(() => {
        popup.style.display = 'none';
    }, duration);
}


// Set persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to LOCAL");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });


// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                userRole = userData.role; // Store the role in the global variable
                console.log(`${userRole} is logged in:`, user);

                // Update the UI for the logged-in user
                updateUIForLoggedInUser(user);

                // Show pop-up
                showPopup(`Welcome back, ${user.displayName || 'User'}! You are logged in as ${userRole}.`);
            } else {
                console.log("User data does not exist in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    } else {
        console.log("No user is logged in");
        userRole = null; // Reset the role
        updateUIForLoggedOutUser();
    }
});

function updateUIForLoggedInUser(user) {
    document.getElementById('login-btn').style.display = 'none'; 
    document.getElementById('logout-btn').style.display = 'block'; 
    document.getElementById('user-menu').style.display = 'block'; 
    document.getElementById('admin-menu').style.display = userRole === 'admin' ? 'block' : 'none'; // Show admin menu if user is an admin
}

function updateUIForLoggedOutUser() {
    document.getElementById('login-btn').style.display = 'block'; 
    document.getElementById('logout-btn').style.display = 'none'; 
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('admin-menu').style.display = 'none'; 
}

//  DARK MODE 

const themeToggleBtn = document.getElementById('theme-toggle-btn');

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  document.body.classList.add(currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  let theme = 'light-mode';
  if (document.body.classList.contains('dark-mode')) {
    theme = 'dark-mode';
  }

  localStorage.setItem('theme', theme);
});









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
  
// Get references to the dropdown buttons and dropdown containers
const manageMealsBtn = document.getElementById('manageMealsBtn');
const mealsDropdown = document.getElementById('mealsDropdown');
// You can add a dropdown for users if needed

// Event listener for the Manage Meals button
manageMealsBtn.addEventListener('click', () => {
    // Toggle the display of the meals dropdown
    if (mealsDropdown.style.display === 'none' || mealsDropdown.style.display === '') {
        mealsDropdown.style.display = 'block';
    } else {
        mealsDropdown.style.display = 'none';
    }
});

// Optional: Add functionality for the Manage Users dropdown if needed


// Select necessary elements
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const otherSuggestionsContainer = document.getElementById('otherSuggestions');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
otherSuggestionsContainer.addEventListener('click', getMealRecipe);


// Load all meals into suggestions when DOM content is loaded
document.addEventListener('DOMContentLoaded', loadSuggestions);
// Select the meal search element
const mealSearch = document.querySelector('.meal-search');

// Add scroll event listener to window
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { 
    mealSearch.classList.add('scrolled');
  } else {
    mealSearch.classList.remove('scrolled');
  }
});


// Event listeners
searchBtn.addEventListener('click', getMealList); // Filter meals when search is clicked
mealList.addEventListener('click', getMealRecipe); // Get recipe for clicked meal
if (recipeCloseBtn) {
    recipeCloseBtn.addEventListener('click', () => {
        const mealDetails = document.querySelector('.meal-details');
        if (mealDetails) {
            mealDetails.style.display = 'none';
            mealDetails.classList.remove('showRecipe');
        }
    });
}


document.addEventListener('DOMContentLoaded', loadSuggestions);



/// Generate star rating HTML based on the rating value
function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += (i <= rating) ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
    }
    return starsHtml;
}

const spinner = document.getElementById('loading-spinner');
// Function to load meal cards from Firestore
async function loadSuggestions() {
    const container = document.getElementById('otherSuggestions');
    if (!container) {
        console.error("otherSuggestions container not found");
        return;
    }

    const mealsRef = collection(db, "meals");

    try {
        const querySnapshot = await getDocs(mealsRef);
        let meals = [];

        querySnapshot.forEach(doc => {
            const meal = doc.data();
            const mealId = doc.id;
            const rating = meal.rating || 0; // Default to 0 if no rating exists

            meals.push({
                id: mealId,
                name: meal.strMeal,
                thumb: meal.strMealThumb,
                category: meal.strCategory,
                area: meal.strArea,
                ingredients: meal,
                instructions: meal.strInstructions,
                youtube: meal.strYoutube,
                rating: rating
            });
        });

        // Sort meals by rating in descending order (highest rating first)
        meals.sort((a, b) => b.rating - a.rating);

        // Generate HTML for sorted meals
        let html = '';
        meals.forEach(meal => {
            html += `
          <div class="meal-item" data-id="${meal.id}">
    <div class="meal-img">
        <img src="${meal.thumb}" alt="${meal.name}">
    </div>
    <div class="meal-name">
        <h3>${meal.name}</h3>
        ${generateStars(meal.rating)}
        <span class="like-btn" data-id="${meal.id}">
            <i class="fa fa-heart-o" aria-hidden="true"></i> <!-- Unliked heart icon -->
        </span>
        <span class="save-btn" data-id="${meal.id}">
            <i class="fa fa-bookmark-o" aria-hidden="true"></i> 
        </span>
    </div>
    <div class="meal-details" style="display: none;">
        <h4>Category: ${meal.category}</h4>
        <p>Area: ${meal.area}</p>
        <h5>Ingredients</h5>
        <ul>${generateIngredients(meal.ingredients)}</ul>
        <h5>Instructions</h5>
        <p>${meal.instructions}</p>
        <div class="recipe-link">
            <a href="${meal.youtube}" target="_blank" style="color: blue; text-decoration: none;">Watch Video</a>
        </div>
    </div>
</div>

            `;
        });

        container.innerHTML = html;

        // Add event listeners for meal items to toggle details display
        // Replace the click event listener for meal items
const mealItems = document.querySelectorAll('.meal-item');
mealItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const mealId = item.getAttribute('data-id');
        // Open a new tab with the meal details page, passing the meal ID as a query parameter
        window.open(`meal-details.html?id=${mealId}`, '_blank');
        e.stopPropagation(); // Prevent triggering other events
    });
});

    } catch (error) {
        console.error('Error fetching meals:', error);
        container.innerHTML = "Error fetching meals.";
    }
}

// Function to generate ingredients list
function generateIngredients(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`<li>${measure} ${ingredient}</li>`);
        }
    }
    return ingredients.join('');
}

document.getElementById('checkIngredientsBtn')?.addEventListener('click', () => {
    const ingredientsInput = document.getElementById('userIngredients');
    
    // Get the "Other Suggestions" container and hide it
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none'; // Hide the container
    }

    if (!ingredientsInput || !ingredientsInput.value) {
        console.warn("No ingredients input provided.");
        return;
        // Exit the function if there's no input
    }

    const userIngredients = ingredientsInput.value.toLowerCase().split(',').map(ing => ing.trim());
    const meals = document.querySelectorAll('.meal');

    meals.forEach(meal => {
        const mealIngredientsAttr = meal.getAttribute('data-ingredients');
        if (!mealIngredientsAttr) return; // Skip if data-ingredients is missing

        const mealIngredients = mealIngredientsAttr.split(',').map(ing => ing.trim().toLowerCase());
        const matchedIngredients = mealIngredients.filter(ingredient => userIngredients.includes(ingredient));
        
        const percentageMatch = (matchedIngredients.length / mealIngredients.length) * 100;
        const percentageElement = document.createElement('div');
        percentageElement.className = 'ingredient-percentage';

        // Color-code based on the match percentage
        if (percentageMatch > 75) {
            percentageElement.style.color = 'green';
        } else if (percentageMatch > 50) {
            percentageElement.style.color = 'yellow';
        } else {
            percentageElement.style.color = 'red';
        }

        percentageElement.textContent = `Ingredient Match: ${Math.round(percentageMatch)}%`;
        meal.appendChild(percentageElement);
    });
});




function getColorForPercentage(percentage) {
    // Return a color from red to green based on the percentage
    const red = Math.min(255, Math.max(0, 255 - (percentage * 2.55))); // Decreases with higher percentage
    const green = Math.min(255, Math.max(0, percentage * 2.55)); // Increases with higher percentage
    return `rgb(${red}, ${green}, 0)`; // Combine red and green to create the gradient
}


async function getMealList() {
    const mealsRef = collection(db, 'meals');
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    const mealList = document.getElementById('meal');
    let html = "";

    const searchSection = document.getElementById('resultsContainer');
    searchSection.scrollIntoView({ behavior: 'smooth' });

    spinner.style.display = 'none';

    if (searchInput === "") {
        mealList.innerHTML = "Please enter a meal name or ingredients to search!";
        return;
    }

    try {
        const snapshot = await getDocs(mealsRef);
        spinner.style.display = 'none'; 
        const matchedMeals = [];

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const meal = doc.data();
                const mealName = meal.strMeal.toLowerCase();
                const mealIngredients = [
                    meal.strIngredient1, meal.strIngredient2, meal.strIngredient3, meal.strIngredient4, meal.strIngredient5,
                    meal.strIngredient6, meal.strIngredient7, meal.strIngredient8, meal.strIngredient9, meal.strIngredient10
                ]
                .filter(ingredient => ingredient !== null && ingredient !== "")
                .map(ingredient => ingredient.toLowerCase());

                // Check if the search input matches the meal name or any of the ingredients
                if (mealName.includes(searchInput) || mealIngredients.includes(searchInput)) {
                    const nameWords = mealName.split(' ');

                    // Determine the position of the search term in the meal name
                    const searchPosition = nameWords.indexOf(searchInput);
                    const positionValue = searchPosition === -1 ? Number.MAX_SAFE_INTEGER : searchPosition;

                    matchedMeals.push({ id: doc.id, ...meal, positionValue });
                }
            });

            // Sort meals: those with search term as the first word come first, then second, and so on
            matchedMeals.sort((a, b) => a.positionValue - b.positionValue);

            if (matchedMeals.length > 0) {
                matchedMeals.forEach(meal => {
                    const starsHtml = generateStars(meal.rating || 0);

                    html += `
                    <div class="meal-item" data-id="${meal.id}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            ${starsHtml}
                            <span class="like-btn" data-id="${meal.id}">
                                <i class="fa fa-heart-o" aria-hidden="true"></i>
                            </span> 
                            <span class="save-btn" data-id="${meal.id}">
                                <i class="fa fa-bookmark-o" aria-hidden="true"></i> 
                            </span>
                        </div>
                        <div class="meal-details" style="display: none;">
                            <h4>Category: ${meal.strCategory}</h4>
                            <p>Area: ${meal.strArea}</p>
                            <h5>Ingredients</h5>
                            <ul>${generateIngredients(meal)}</ul>
                            <h5>Instructions</h5>
                            <p>${meal.strInstructions}</p>
                            <div class="recipe-link">
                                <a href="${meal.strYoutube}" target="_blank" style="color: blue; text-decoration: none;">Watch Video</a>
                            </div>
                        </div>
                    </div>
                    `;
                });
                suggestionsContainer.style.display = 'none';
            } else {
                html = `Sorry, no meals found for "${searchInput}"!`;
            }
        } else {
            html = "No meals in the database!";
        }

        mealList.innerHTML = html;
        suggestionsContainer.style.display = 'none';

        // Replace the click event listener for meal items
const mealItems = document.querySelectorAll('.meal-item');
mealItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const mealId = item.getAttribute('data-id');
        // Open a new tab with the meal details page, passing the meal ID as a query parameter
        window.open(`meal-details.html?id=${mealId}`, '_blank');
        e.stopPropagation(); // Prevent triggering other events
    });
});


    } catch (error) {
        console.error('Error fetching meals:', error);
        spinner.style.display = 'none'; 
        mealList.innerHTML = "Error fetching meals.";
    }
}



document.getElementById('checkIngredientsBtn').addEventListener('click', getMatchingMealList);

function getMatchingMealList() {
    const mealsRef = collection(db, 'meals');
    const searchInput = document.getElementById('userIngredients').value.trim();
    const mealList = document.getElementById('meal');
    spinner.style.display = 'block'; 
    let html = "";

    const searchSection = document.getElementById('resultsContainer');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
    }

    spinner.style.display = 'block'; 

    if (searchInput === "") {
        mealList.innerHTML = "Please enter your available ingredients to search!";
        return;
    }

    const userIngredients = searchInput.split(',').map(ingredient => ingredient.trim().toLowerCase());
    console.log('User Ingredients:', userIngredients);

    getDocs(mealsRef).then((snapshot) => {
        const matchedMeals = [];
        spinner.style.display = 'none'; 

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const meal = doc.data();
                const mealIngredients = [
                    meal.strIngredient1, meal.strIngredient2, meal.strIngredient3, meal.strIngredient4, meal.strIngredient5,
                    meal.strIngredient6, meal.strIngredient7, meal.strIngredient8, meal.strIngredient9, meal.strIngredient10
                ]
                .filter(ingredient => ingredient !== null && ingredient !== "")
                .map(ingredient => ingredient.toLowerCase());

                console.log('Meal Ingredients:', mealIngredients);

                const matchingIngredients = userIngredients.filter(ing => mealIngredients.includes(ing));
                const matchCount = matchingIngredients.length;
                const totalIngredients = mealIngredients.length;
                const matchPercentage = totalIngredients > 0 ? ((matchCount / totalIngredients) * 100).toFixed(2) : 0;

                if (matchCount > 0) {
                    matchedMeals.push({ id: doc.id, ...meal, matchCount, matchPercentage });
                }
            });

            matchedMeals.sort((a, b) => b.matchPercentage - a.matchPercentage);

            if (matchedMeals.length > 0) {
                matchedMeals.forEach(meal => {
                    const starsHtml = generateStars(meal.rating || 0);
                    const percentageColor = getColorForPercentage(meal.matchPercentage);

                    html += `
                        <div class="meal-item" data-id="${meal.id}" data-ingredients="${meal.strIngredients || ''}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                ${starsHtml}
                                <p style="color: ${percentageColor};">Ingredients Match: ${meal.matchPercentage}%</p>
                                <div class"like-btn"
                                <span class="like-btn" data-id="${meal.id}">
                                    <i class="fa fa-heart-o" aria-hidden="true"></i>
                                </span> 
                                </div>
                                <span class="save-btn" data-id="${meal.id}">
                                    <i class="fa fa-bookmark-o" aria-hidden="true"></i>
                                </span>
                            </div>
                            <div class="meal-details" style="display: none;">
                                <h4>Category: ${meal.strCategory}</h4>
                                <p>Area: ${meal.strArea}</p>
                                <h5>Ingredients</h5>
                                <ul>${generateIngredients(meal)}</ul>
                                <h5>Instructions</h5>
                                <p>${meal.strInstructions}</p>
                                <div class="recipe-link">
                                    <a href="${meal.strYoutube}" target="_blank" style="color: blue; text-decoration: none;">Watch Video</a>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = `Sorry, no meals found for your ingredients!`;
            }
        } else {
            html = "No meals in the database!";
        }

        mealList.innerHTML = html;

        const mealItems = document.querySelectorAll('.meal-item');
        mealItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const mealId = item.getAttribute('data-id');
                // Open a new tab with the meal details page, passing the meal ID as a query parameter
                window.open(`meal-details.html?id=${mealId}`, '_blank');
                e.stopPropagation(); // Prevent triggering other events
            });
        });

    }).catch((error) => {
        console.error('Error fetching meals:', error);
        spinner.style.display = 'none'; 
        mealList.innerHTML = "Error fetching meals.";
    });
}




function extractKeywords(input) {
    // Use compromise.js to find nouns (common in ingredients) and adjectives (preferences)
    const doc = nlp(input);
    const ingredients = doc.nouns().out('array');
    const preferences = doc.adjectives().out('array');
    
    // Merge keywords with unique filtering
    const keywords = [...new Set([...ingredients, ...preferences])];
    return keywords;
}
// Add event listeners for like and save buttons
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevents the meal item click event from being triggered

        // Check if the user is logged in
        if (!user || !user.uid) {
            alert('Please log in to like meals.');
            return; // Exit if the user is not logged in
        }

        const mealId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');

        try {
            // Toggle like status in Firestore
            const userDocRef = doc(db, 'userPreferences', user.uid);
            const userDoc = await getDoc(userDocRef);

            let likedRecipes = [];
            if (userDoc.exists()) {
                likedRecipes = userDoc.data().likedRecipes || [];
            }

            if (likedRecipes.includes(mealId)) {
                // Remove from likes
                likedRecipes = likedRecipes.filter(id => id !== mealId);
                icon.classList.replace('fa-heart', 'fa-heart-o'); // Change icon to unliked state
            } else {
                // Add to likes
                likedRecipes.push(mealId);
                icon.classList.replace('fa-heart-o', 'fa-heart'); // Change icon to liked state
            }

            // Update Firestore
            await setDoc(userDocRef, { likedRecipes }, { merge: true });
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    });
});
// Add event listeners for like and save buttons
document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Stop event from propagating to parent card click

        const mealId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const user = getAuth().currentUser; // Get the current user

        if (!user) {
            alert('Please log in to like a meal!');
            return;
        }

        try {
            // Toggle like status in Firestore
            const userDocRef = doc(db, 'userPreferences', user.uid);
            const userDoc = await getDoc(userDocRef);

            let likedRecipes = [];
            if (userDoc.exists()) {
                likedRecipes = userDoc.data().likedRecipes || [];
            }

            if (likedRecipes.includes(mealId)) {
                // Remove from likes
                likedRecipes = likedRecipes.filter(id => id !== mealId);
                icon.classList.replace('fa-heart', 'fa-heart-o'); // Change icon to unliked state
            } else {
                // Add to likes
                likedRecipes.push(mealId);
                icon.classList.replace('fa-heart-o', 'fa-heart'); // Change icon to liked state
            }

            // Update Firestore
            await setDoc(userDocRef, { likedRecipes }, { merge: true });
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    });
});

document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Stop event from propagating to parent card click

        const mealId = btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
        const user = getAuth().currentUser; // Get the current user

        if (!user) {
            alert('Please log in to save a meal!');
            return;
        }

        try {
            // Toggle save status in Firestore
            const userDocRef = doc(db, 'userPreferences', user.uid);
            const userDoc = await getDoc(userDocRef);

            let savedRecipes = [];
            if (userDoc.exists()) {
                savedRecipes = userDoc.data().savedRecipes || [];
            }

            if (savedRecipes.includes(mealId)) {
                // Remove from saved
                savedRecipes = savedRecipes.filter(id => id !== mealId);
                icon.classList.replace('fa-bookmark', 'fa-bookmark-o'); // Change icon to unsaved state
            } else {
                // Add to saved
                savedRecipes.push(mealId);
                icon.classList.replace('fa-bookmark-o', 'fa-bookmark'); // Change icon to saved state
            }

            // Update Firestore
            await setDoc(userDocRef, { savedRecipes }, { merge: true });
        } catch (error) {
            console.error('Error updating saved recipes:', error);
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    // Cache the back button
    const backBtn = document.getElementById('backBtn');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const favoriteMealsList = document.getElementById('favoriteMealsList');

    // Back Button Event Listener
    backBtn.addEventListener('click', () => {
        if (favoritesContainer.style.display === 'block') {
            // Hide favorites and show suggestions when back button is clicked
            favoritesContainer.style.display = 'none';
            suggestionsContainer.style.display = 'block';
            resultsContainer.style.display = 'block';
            backBtn.style.display = 'none'; // Hide back button when returning
        } else if (window.history.length > 1) {
            window.history.back(); // Go to the previous page in history
        } else {
            window.location.href = '/'; // Go to the homepage if no history is available
        }
    });



// Event listener for loading favorites


document.getElementById('loadFavoritesBtn').addEventListener('click', loadFavorites);

async function loadFavorites() {
    const user = auth.currentUser;
    if (!user) {
        console.log("User is not logged in.");
        return;
    }

    // Hide suggestions and other content
    suggestionsContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    closeNav();

    // Display the back button when in the "Favorites" section
    backBtn.style.display = 'inline-block';

    // Reset favorites list HTML
    let html = "";
    favoriteMealsList.innerHTML = "<p>Loading favorites...</p>"; // Show loading state
    favoritesContainer.style.display = 'block';

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const favorites = userDoc.data().favorites || []; // Array of meal IDs

            if (favorites.length > 0) {
                // Fetch each meal's data
                for (const mealId of favorites) {
                    const mealDoc = await getDoc(doc(db, 'meals', mealId));
                    if (mealDoc.exists()) {
                        const meal = mealDoc.data();
                        const stars = meal.rating || 0; // Get meal rating or default to 0
            
                        // Generate stars based on the rating
                        let starsHtml = '';
                        for (let i = 1; i <= 5; i++) {
                            starsHtml += i <= stars ? '<span class="fa fa-star checked"></span>' : '<span class="fa fa-star"></span>';
                        }
            
                        // Determine if the meal is liked and set the icon accordingly
                        const heartIcon = favorites.includes(mealId) ? 'fa-heart' : 'fa-heart-o';
            
                        html += `
                            <div class="meal-item" data-id="${meal.id}">
                                <div class="meal-img">
                                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                </div>
                                <div class="meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    ${starsHtml} <!-- Include the dynamically generated stars -->
                                    <a href="#" class="recipe-btn">Get Recipe</a>
                                    <span class="like-btn" data-id="${meal.id}" onclick="toggleLikeMeal('${meal.id}', this)">
                                        <i class="fa ${heartIcon}" aria-hidden="true"></i> <!-- Set correct heart icon -->
                                    </span>
                                </div>
                            </div>
                        `;
                    }
                }
            } else {
                html = "<p>No favorite meals yet!</p>";
            }
            
           
        } else {
            html = "<p>Error retrieving user data.</p>";
        }

        // Update HTML and show the favorites container
        favoriteMealsList.innerHTML = html;
    } catch (error) {
        console.error("Error loading favorites:", error);
        favoriteMealsList.innerHTML = "<p>Error loading favorites.</p>";
    }
}
});


    // JavaScript functions to populate recently viewed and suggested meals
    async function loadPersonalizedContent() {
        await displayRecentlyViewedMeals();
        await getSuggestionsBasedOnLikes();
        await logViewedMeal();
    }

    // Call loadPersonalizedContent on page load
    window.addEventListener('load', loadPersonalizedContent);


async function logViewedMeal(mealId) {
    const user = auth.currentUser;
    if (!user) return;

    const userPreferencesRef = doc(db, "userPreferences", user.uid);
    try {
        await updateDoc(userPreferencesRef, {
            viewedRecipes: arrayUnion(mealId)
        });
        console.log(`Viewed meal ${mealId} logged.`);
    } catch (error) {
        console.error("Error logging viewed meal:", error);
    }
}



async function displayRecentlyViewedMeals() {
    const user = auth.currentUser;
    if (!user) return;

    const userPreferencesRef = doc(db, "userPreferences", user.uid);
    try {
        const userDoc = await getDoc(userPreferencesRef);
        if (userDoc.exists()) {
            const viewedRecipes = userDoc.data().viewedRecipes.slice(-5); // Get the last 5 viewed meals
            let html = "";

            for (const mealId of viewedRecipes) {
                const mealDoc = await getDoc(doc(db, "meals", mealId));
                if (mealDoc.exists()) {
                    const meal = mealDoc.data();
                    html += `<div class="meal-item">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                <h3>${meal.strMeal}</h3>
                             </div>`;
                }
            }

            document.getElementById("recentlyViewedContainer").innerHTML = html;
        }
    } catch (error) {
        console.error("Error fetching viewed meals:", error);
    }
}


async function getSuggestionsBasedOnLikes() {
    const user = auth.currentUser;
    if (!user) return;

    const userPreferencesRef = doc(db, "userPreferences", user.uid);
    try {
        const userDoc = await getDoc(userPreferencesRef);
        if (userDoc.exists()) {
            const likedRecipes = userDoc.data().likedRecipes || [];
            const preferences = {};

            for (const mealId of likedRecipes) {
                const mealDoc = await getDoc(doc(db, "meals", mealId));
                if (mealDoc.exists()) {
                    const meal = mealDoc.data();
                    preferences[meal.category] = (preferences[meal.category] || 0) + 1;
                }
            }

            // Now use `preferences` to suggest recipes from top categories
            const topCategory = Object.keys(preferences).sort((a, b) => preferences[b] - preferences[a])[0];
            displaySuggestedRecipes(topCategory);
        }
    } catch (error) {
        console.error("Error fetching liked meals:", error);
    }
}




async function displaySuggestedRecipes(category) {
    const querySnapshot = await getDocs(query(collection(db, "meals"), where("category", "==", category)));
    let html = "";

    querySnapshot.forEach((doc) => {
        const meal = doc.data();
        html += `<div class="meal-item">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                 </div>`;
    });

    document.getElementById("suggestedRecipesContainer").innerHTML = html;
}

















// Show recipe details when 'Get Recipe' is clicked
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.closest('.meal-item');
        const mealId = mealItem.getAttribute('data-id');

        const mealRef = doc(db, 'meals', mealId);
        getDoc(mealRef).then((docSnap) => {
            if (docSnap.exists()) {
                const meal = docSnap.data();
                showRecipeDetails(meal);  // Call the showRecipeDetails function to populate details
            } else {
                console.log('No such meal in the database!');
            }
        }).catch((error) => {
            console.error('Error getting meal details:', error);
        });
    }
}



// Function to display recipe details
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
        <button type="button" class="btn recipe-close-btn" id="recipe-close-btn">Close</button>
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category"><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
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
    <a href="${meal.strYoutube}" target="_blank" style="color: blue; text-decoration: none;">Watch Video</a>
</div>

    `;

    const mealDetails = document.querySelector('.meal-details-content');
    const mealDetailsContainer = document.querySelector('.meal-details');

    mealDetails.innerHTML = mealDetailsContent;

    // Show the meal details container
    mealDetailsContainer.classList.add('show');
    mealDetailsContainer.style.display = 'block';

    // Add close button functionality
    document.getElementById('recipe-close-btn').addEventListener('click', closeMealDetails);
}

// Function to hide meal details
function closeMealDetails() {
    const mealDetailsContainer = document.querySelector('.meal-details');
    mealDetailsContainer.classList.remove('show');
    mealDetailsContainer.style.display = 'none';
}

// Debounce function to limit how often we call getMealList
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}





// Attach event listeners
document.getElementById('search-input').addEventListener('input', debounce(getMealList, 300));
document.getElementById('meal').addEventListener('click', getMealRecipe);


// Get the modal and login button elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('login-btn');

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
    closeLoginModal();
    openSignupModal();
});

function openSignupModal() {
    signupModal.style.display = 'block';
}

// Close signup modal function
document.getElementById('closesignup').addEventListener('click', closeSignupModal);

function closeSignupModal() {
    signupModal.style.display = 'none';
}

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
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form submission
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('email').value;

    // Check if a role is selected
    const roleInput = document.querySelector('input[name="role"]:checked');
    if (!roleInput) {
        showMessage('Please select a role', 'signUpMessage');
        return;
    }
    const role = roleInput.value;

    // Basic validation for email and password
    if (!/\S+@\S+\.\S+/.test(email)) {
        showMessage('Please enter a valid email address', 'signUpMessage');
        return;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'signUpMessage');
        return;
    }

    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user profile data in the 'users' collection
        const userProfileRef = doc(db, "users", user.uid);
        const userData = {
            username: username,
            email: email,
            role: role // Store the user's role
        };
        await setDoc(userProfileRef, userData);

        // Initialize userPreferences document in Firestore with default preferences
        const userPreferencesRef = doc(db, "userPreferences", user.uid);
        const defaultPreferences = {
            likedRecipes: [],
            savedRecipes: [],
            viewedRecipes: []
        };
        await setDoc(userPreferencesRef, defaultPreferences);

        console.log("User profile and preferences initialized in Firestore");

        // Close signup modal and redirect after successful signup
        closeSignupModal();
        window.location.href = 'index.html'; 

    } catch (error) {
        console.error('Error during sign up:', error);

        // Handle specific error codes
        if (error.code === 'auth/email-already-in-use') {
            showMessage('Email already exists', 'signUpMessage');
        } else {
            showMessage('Error: ' + error.message, 'signUpMessage');
        }
    }
});

const loginError = document.getElementById('loginError');

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
                        loginError.textContent = 'User data not found in Firestore.';
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    loginError.textContent = 'Error fetching user data.';
                });
        })
        .catch((error) => {
            console.error('Login error:', error.message);
            loginError.textContent = 'Failed to log in. Please check your credentials.';
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
            closeNav();
            updateUIForLoggedOutUser(); // Update the UI for logged-out state
        })
        .catch((error) => {
            console.error('Error signing out:', error.message);
        });
});

// Get modal elements
const addMealModal = document.getElementById('addMealModal');
const closeAddMealModal = document.getElementById('closeAddMealModal');
const addMealBtn = document.getElementById('addMealBtn');

// Function to open the Add Meal modal
function openAddMealModal() {
    closeNav();
    addMealModal.style.display = 'block'; // Show the modal
}

// Function to close the Add Meal modal
closeAddMealModal.addEventListener('click', () => {
    addMealModal.style.display = 'none'; // Hide the modal
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === addMealModal) {
        addMealModal.style.display = 'none';
         // Hide the modal
    }
});
// Event listener for the Add Meal button
addMealBtn.addEventListener('click', openAddMealModal);

// Get the add meal form and submit button
const addMealForm = document.getElementById('addMealForm');
const ingredientsContainer = document.getElementById('ingredientsContainer');

// Event listener for the form submission
addMealForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect meal data from the form
    const mealName = document.getElementById('mealName').value;
    const mealCategory = document.getElementById('mealCategory').value;
    const mealArea = document.getElementById('mealArea').value;
    const mealImageUrl = document.getElementById('mealImageUrl').value;
    const mealInstructions = document.getElementById('mealInstructions').value;

    // Collect ingredients from the input fields
    const ingredients = [];
    const ingredientInputs = ingredientsContainer.getElementsByClassName('ingredient');
    for (let input of ingredientInputs) {
        if (input.value) {
            ingredients.push(input.value);
        }
    }

    // Get the selected rating
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;

    // Create a meal object with ingredients and rating
    const mealData = {
        strMeal: mealName,
        strCategory: mealCategory,
        strArea: mealArea,
        strMealThumb: mealImageUrl,
        strInstructions: mealInstructions,
        rating: parseInt(rating), // Convert rating to a number
        // Individual ingredient fields
        strIngredient1: ingredients[0] || null,
        strIngredient2: ingredients[1] || null,
        strIngredient3: ingredients[2] || null,
        strIngredient4: ingredients[3] || null,
        strIngredient5: ingredients[4] || null,
        strIngredient6: ingredients[5] || null,
        strIngredient7: ingredients[6] || null,
        strIngredient8: ingredients[7] || null,
        strIngredient9: ingredients[8] || null,
        strIngredient10: ingredients[9] || null,
        strIngredient11: ingredients[10] || null,
        strIngredient12: ingredients[11] || null,
        strIngredient13: ingredients[12] || null,
        strIngredient14: ingredients[13] || null,
        strIngredient15: ingredients[14] || null,
        strIngredient16: ingredients[15] || null,
        strIngredient17: ingredients[16] || null,
        strIngredient18: ingredients[17] || null,
        strIngredient19: ingredients[18] || null,
        strIngredient20: ingredients[19] || null,
    };

    try {
        // Add the meal data to Firestore
        const docRef = await addDoc(collection(db, 'meals'), mealData);
        console.log('Meal added with ID:', docRef.id);

        // Reset the form fields
        addMealForm.reset();
        ingredientsContainer.innerHTML = '<input type="text" class="ingredient" placeholder="Ingredient 1" required>'; // Reset ingredients

        // Close the modal
        addMealModal.style.display = 'none';
        alert('Meal added successfully!');
    } catch (error) {
        console.error('Error adding meal:', error);
    }
});

// Optional: Add functionality to dynamically add ingredient fields
document.getElementById('addIngredientBtn').addEventListener('click', () => {
    const newIngredientInput = document.createElement('input');
    newIngredientInput.type = 'text';
    newIngredientInput.className = 'ingredient';
    newIngredientInput.placeholder = `Ingredient ${ingredientsContainer.children.length + 1}`;
    ingredientsContainer.appendChild(newIngredientInput);
});

// Open the Manage Meals Modal
document.getElementById('deleteMealBtn').addEventListener('click', async () => {
    const manageMealsModal = document.getElementById('manageMealsModal');
    const mealListContainer = document.getElementById('mealListContainer');

    try {
        // Fetch all meals from Firestore
        const mealsRef = collection(db, 'meals');
        const mealsSnapshot = await getDocs(mealsRef);

        let mealListHtml = "<ul>";

        mealsSnapshot.forEach(doc => {
            const meal = doc.data();
            mealListHtml += `
            <li style="display: flex; justify-content: space-between; align-items: center;">
                <strong>${meal.strMeal}</strong> (ID: ${doc.id})
                <div class="manage-btn" style="display: flex; gap: 10px;">
                    <button class="edit-meal-btn" data-id="${doc.id}">Edit</button>
                    <button class="delete-meal-btn" data-id="${doc.id}">Delete</button>
                </div>
            </li>
        `;
        
        });
        closeNav();

        mealListHtml += "</ul>";

        // Populate the modal with the meal list
        mealListContainer.innerHTML = mealListHtml;

        // Show the modal
        manageMealsModal.style.display = 'block';

        // Attach event listeners to Delete buttons
        const deleteButtons = document.querySelectorAll('.delete-meal-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const mealId = e.target.getAttribute('data-id');
                deleteMeal(mealId);
            });
        });

        // Attach event listeners to Edit buttons
        const editButtons = document.querySelectorAll('.edit-meal-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mealId = e.target.getAttribute('data-id');
                editMeal(mealId);
            });
        });

    } catch (error) {
        console.error('Error fetching meals for management:', error);
        alert('Failed to load meals.');
    }
});

// Close the Manage Meals Modal
document.getElementById('closeManageMealsModal').addEventListener('click', () => {
    const manageMealsModal = document.getElementById('manageMealsModal');
    manageMealsModal.style.display = 'none';
});

// Delete meal from Firestore
async function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal?')) {
        try {
            const mealDocRef = doc(db, 'meals', mealId);
            await deleteDoc(mealDocRef);
            alert('Meal deleted successfully.');

            // Reload the meal list after deletion
            document.getElementById('deleteMealBtn').click();
        } catch (error) {
            console.error('Error deleting meal:', error);
            alert('Failed to delete the meal.');
        }
    }
}

// Edit meal (you can extend this to open an edit modal or form)
function editMeal(mealId) {
    // Fetch meal details and open an edit form
    console.log(`Edit meal with ID: ${mealId}`);
    
}
// Get the modal elements
const editMealModal = document.getElementById('editMealModal');
const closeEditMealModal = document.getElementById('closeEditMealModal');
const editMealForm = document.getElementById('editMealForm');

// Open Edit Meal Modal
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-meal-btn')) {
        const mealId = e.target.dataset.id;

        // Fetch the meal data from Firestore using the mealId
        const mealRef = doc(db, 'meals', mealId);
        const mealDoc = await getDoc(mealRef);

        if (mealDoc.exists()) {
            const mealData = mealDoc.data();

            // Fill the modal inputs with existing meal data
            document.getElementById('editMealName').value = mealData.strMeal;
            document.getElementById('editMealCategory').value = mealData.strCategory;
            document.getElementById('editMealArea').value = mealData.strArea;
            document.getElementById('editMealImageUrl').value = mealData.strMealThumb;
            document.getElementById('editMealInstructions').value = mealData.strInstructions;

            // Populate the ingredients
            const editIngredientsContainer = document.getElementById('editIngredientsContainer');
            editIngredientsContainer.innerHTML = ''; // Clear previous inputs
            for (let i = 1; i <= 20; i++) {
                const ingredient = mealData[`strIngredient${i}`];
                if (ingredient) {
                    const ingredientInput = document.createElement('input');
                    ingredientInput.type = 'text';
                    ingredientInput.classList.add('ingredient');
                    ingredientInput.value = ingredient;
                    ingredientInput.placeholder = `Ingredient ${i}`;
                    editIngredientsContainer.appendChild(ingredientInput);
                }
            }

            // Show the edit modal
            editMealModal.style.display = 'block';

            // Store the mealId in a hidden field or globally
            editMealForm.dataset.mealId = mealId;
        } else {
            console.error('Meal not found!');
        }
    }
});

// Close Edit Meal Modal
closeEditMealModal.addEventListener('click', () => {
    editMealModal.style.display = 'none';
});
editMealForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mealId = editMealForm.dataset.mealId;

    // Get updated meal data from the form
    const updatedMealData = {
        strMeal: document.getElementById('editMealName').value,
        strCategory: document.getElementById('editMealCategory').value,
        strArea: document.getElementById('editMealArea').value,
        strMealThumb: document.getElementById('editMealImageUrl').value,
        strInstructions: document.getElementById('editMealInstructions').value,
    };

   
    const ingredients = [];
    document.querySelectorAll('#editIngredientsContainer input').forEach((input, index) => {
        if (input.value.trim() !== '') {
            ingredients.push(input.value);
        }
    });

    // Add ingredients to updated meal data
    for (let i = 1; i <= 20; i++) {
        updatedMealData[`strIngredient${i}`] = ingredients[i - 1] || null;
    }

   // Check for rating in the form and add to meal data, default to 0 if none selected
const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
updatedMealData.rating = parseInt(rating);


    try {
        
        const mealRef = doc(db, 'meals', mealId);
        await updateDoc(mealRef, updatedMealData);

    
        editMealModal.style.display = 'none';

        // Refresh or reload the meal list
        getMealList();
        console.log(updatedMealData.recipeCloseBtn);
        await updateDoc(mealRef, updatedMealData);
        console.log("Meal updated successfully"); // Make sure rating is present here


    } catch (error) {
        console.error('Error updating meal:', error);
    }
   
    
    
});




  // Counter for the number of ingredients
  let ingredientCount = 1;

  // Event listener for the Add Ingredient button
  document.getElementById('addEditIngredientBtn').addEventListener('click', () => {
    ingredientCount++; // Increment the ingredient count

    // Create a new input element for the ingredient
    const newIngredientInput = document.createElement('input');
    newIngredientInput.type = 'text';
    newIngredientInput.classList.add('ingredient');
    newIngredientInput.id = `editIngredient${ingredientCount}`;
    newIngredientInput.placeholder = `Ingredient ${ingredientCount}`;

    // Append the new input to the container
    document.getElementById('editIngredientsContainer').appendChild(newIngredientInput);
  });
// Function to open the Manage Users modal
function openManageUsersModal() {
    const modal = document.getElementById('manageUsersModal');
    modal.style.display = 'block'; // Show the modal
    fetchUsers(); // Fetch and display users
}

// Function to fetch users from Firestore
async function fetchUsers() {
    const usersRef = collection(db, 'users'); // Reference to the 'users' collection

    try {
        const snapshot = await getDocs(usersRef);
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear previous user list

        snapshot.forEach((doc) => {
            const userData = doc.data();
            const userId = doc.id;
            const userEmail = userData.email;
            const userRole = userData.role;

            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <strong>${userEmail}</strong> (Role: ${userRole})
                <div>
                    <button class="change-role-btn" data-id="${userId}">Change Role</button>
                    <button class="delete-user-btn" data-id="${userId}">Delete</button>
                </div>
            `;
            userList.appendChild(userItem);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Add event listeners for buttons
document.getElementById('manageUsersBtn').addEventListener('click', openManageUsersModal);
document.getElementById('closeManageUsersModal').addEventListener('click', () => {
    const modal = document.getElementById('manageUsersModal');
    modal.style.display = 'none'; // Close the modal
});

// Event delegation for buttons within the user list
document.getElementById('userList').addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('delete-user-btn')) {
        const userId = target.getAttribute('data-id');
        deleteUser(userId);
    } else if (target.classList.contains('change-role-btn')) {
        const userId = target.getAttribute('data-id');
        changeUserRole(userId);
    }
});

// Function to delete a user
async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}
function changeUserRole(userId, currentRole) {
    // Create a dropdown for role selection
    const roleSelect = document.createElement('select');
    roleSelect.innerHTML = `
        <option value="user" ${currentRole === 'user' ? 'selected' : ''}>User</option>
        <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Admin</option>
    `;

    // Create a confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Change Role';
    confirmButton.addEventListener('click', async () => {
        const newRole = roleSelect.value; // Get the selected role
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            fetchUsers(); // Refresh the user list after role change
        } catch (error) {
            console.error('Error changing user role:', error);
        }
        // Close the dropdown
        roleSelect.remove();
        confirmButton.remove();
    });

    // Append dropdown and button to the user list item
    const userItem = document.querySelector(`[data-id="${userId}"]`).parentNode; // Get the parent node (li)
    userItem.appendChild(roleSelect);
    userItem.appendChild(confirmButton);
}
