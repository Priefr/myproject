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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
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
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// Get meal list from the database
function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim();

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

// Open login modal when login button is clicked
// loginBtn.addEventListener('click', () => {
//     loginModal.style.display = 'block';
// });
function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'block';
}

// Close login modal function
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'none';
}


// Close login modal when 'x' is clicked
closeBtnLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

// Close the modal if user clicks outside
window.addEventListener('click', (event) => {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
});

// Show signup modal when the sign-up button is clicked
// Function to open the signup modal
function openSignupModal() {
    const signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'block';
}

// Function to close the signup modal
function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'none';
}

// Function to close the signup modal if clicked outside the modal
window.onclick = function(event) {
    const signupModal = document.getElementById('signupModal');
    const loginModal = document.getElementById('loginModal');
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
}

// Handle the signup process
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('email').value;

    // Create user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed up successfully
            const user = userCredential.user;
            console.log('User registered:', user);
            // Optionally, store the username in the database for future use
            // Call a function to store additional user details in Firestore here
            closeSignupModal(); // Close signup modal
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert('Error: ' + errorMessage); // Show error message
        });
});



// Handle the login process
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const email = document.getElementById('username').value; // Using email as username
    const password = document.getElementById('password').value;

    // Sign in user
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User logged in successfully
            const user = userCredential.user;
            console.log(`${user.email} logged in`);
            // Save user role in localStorage (you can fetch this from Firestore)
            localStorage.setItem('userRole', 'user'); // Default role, update this later
            closeLoginModal(); // Close login modal
            updateSidebar('user'); // Update sidebar for user
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert('Error: ' + errorMessage); // Show error message
        });
});

// Update sidebar based on the role
function updateSidebar(role) {
    if (role === 'admin') {
        document.getElementById('admin-menu').style.display = 'block';
        document.getElementById('user-menu').style.display = 'none';
    } else if (role === 'user') {
        document.getElementById('admin-menu').style.display = 'none';
        document.getElementById('user-menu').style.display = 'block';
    }
}

// Handle login process
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Fetch user role from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        localStorage.setItem('userRole', role);
                        console.log('Logged in as:', role);

                        // Hide the login modal
                        loginModal.style.display = 'none';

                        // Update sidebar based on role
                        updateSidebar(role);

                        // Show logout button and hide login button
                        loginBtn.style.display = 'none';
                        document.getElementById('logout-btn').style.display = 'block';

                        console.log('Login successful!');
                    } else {
                        console.log('No such document!');
                    }
                });
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Error: ' + error.message);
        });
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem('userRole');
            document.getElementById('login-btn').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'none';
            console.log('Logout successful');
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
});

// Update sidebar based on the role
function updateSidebar(role) {
    if (role === 'admin') {
        document.getElementById('admin-menu').style.display = 'block';
        document.getElementById('user-menu').style.display = 'none';
    } else if (role === 'user') {
        document.getElementById('admin-menu').style.display = 'none';
        document.getElementById('user-menu').style.display = 'block';
    }
}

// script.js
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Show or hide the navbar based on the scroll direction
    if (scrollTop > lastScrollTop) {
        navbar.style.top = "-60px"; // Hide the navbar
    } else {
        navbar.style.top = "0"; // Show the navbar
    }

    lastScrollTop = scrollTop; // Update last scroll position
});


// Show login success message
function showLoginSuccess() {
    const successMessage = document.createElement('div');
    successMessage.textContent = 'Login successful!';
    successMessage.classList.add('login-success-message'); // Add your custom styles here
    document.body.insertAdjacentElement('afterbegin', successMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Handle logout
function logout() {
    localStorage.removeItem('userRole');
    location.reload(); // Refresh the page to reset the UI
}

// Get all elements with the class 'dropdown-btn' and add event listeners to them
const dropdown = document.querySelectorAll('.dropdown-btn');

dropdown.forEach(button => {
  button.addEventListener('click', function() {
    this.classList.toggle('active');
    const dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  });
});
// Opening the Add Meal Modal
document.getElementById('addMealBtn').addEventListener('click', () => {
    // Open the modal (assuming the modal setup is from the previous code)
    modal.style.display = 'block';
  });
  // Get the modal element
var modal = document.getElementById('addMealModal');

// Get the button that opens the modal
var btn = document.getElementById('addMealBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
var ingredientsContainer = document.getElementById("ingredientsContainer");

var addIngredientBtn = document.getElementById("addIngredientBtn");

var ingredientCount = 1;

addIngredientBtn.onclick = function() {
  ingredientCount++;
  // Create a new input element
  var newIngredient = document.createElement("input");
  newIngredient.type = "text";
  newIngredient.className = "ingredient";
  newIngredient.placeholder = "Ingredient " + ingredientCount;
  
  // Append the new input to the ingredients container
  ingredientsContainer.appendChild(newIngredient);
};

document.getElementById('addMealForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Capture the form data
    const mealData = {
        mealName: document.getElementById('mealName').value,
        category: document.getElementById('mealCategory').value,
        area: document.getElementById('mealArea').value,
        imageUrl: document.getElementById('mealImageUrl').value,
        instructions: document.getElementById('mealInstructions').value,
        ingredients: [...document.querySelectorAll('.ingredient')].map(input => input.value)
    };

    // Send the data to the server (adjust the endpoint as needed)
    fetch('/addMeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Meal added successfully!');
            // Optionally reset the form and close the modal
            document.getElementById('addMealForm').reset();
            document.getElementById('addMealModal').style.display = 'none';
        } else {
            alert('Failed to add meal. Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
});

  
  // Delete Meal functionality
  document.getElementById('deleteMealBtn').addEventListener('click', () => {
    // Fetch meals to display to delete (or open a delete meal form)
    fetch('/meals')
      .then(response => response.json())
      .then(meals => {
        // Display a list of meals with delete buttons
        let mealListHtml = '<h3>Delete a Meal</h3><ul>';
        meals.forEach(meal => {
          mealListHtml += `
            <li>
              ${meal.name} 
              <button onclick="deleteMeal(${meal.id})">Delete</button>
            </li>`;
        });
        mealListHtml += '</ul>';
  
        // Insert this HTML into the page
        document.getElementById('mealListContainer').innerHTML = mealListHtml;
      });
  });
  
  // Function to handle meal deletion
  function deleteMeal(mealId) {
    if (confirm('Are you sure you want to delete this meal?')) {
      fetch(`/meals/${mealId}`, {
        method: 'DELETE'
      })
      .then(() => {
        alert('Meal deleted successfully');
        // Optionally refresh the meal list
      });
    }
  }
  function displayMeal(meal) {
    const mealImage = meal.image_url || 'default-image.jpg'; // Use default image if image_url is NULL
    const instructions = meal.strInstructions || 'No instructions available'; // Default message if instructions are NULL

    // Render meal data
    document.getElementById('mealImage').src = mealImage;
    document.getElementById('mealInstructions').innerText = instructions;

    // Handle ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            ingredients.push(ingredient);
        }
    }

    document.getElementById('ingredientsList').innerHTML = ingredients.map(ing => `<li>${ing}</li>`).join('');
}
// Show the Signup Modal when "Sign Up" is clicked
document.getElementById("showSignupModal").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "none"; // Hide login modal
    document.getElementById("signupModal").style.display = "block"; // Show signup modal
});

// Handle closing the modals
var closeModalButtons = document.getElementsByClassName("close");
for (let i = 0; i < closeModalButtons.length; i++) {
    closeModalButtons[i].addEventListener("click", function() {
        this.parentElement.parentElement.style.display = "none";
    });
}
