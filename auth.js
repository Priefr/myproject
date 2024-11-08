
function getMealList() {
    const mealsRef = collection(db, 'meals');
    const searchInput = document.getElementById('search-input').value.trim();
    const mealList = document.getElementById('meal');
    let html = "";

    const searchSection = document.getElementById('resultsContainer');
    searchSection.scrollIntoView({ behavior: 'smooth' });

    mealList.innerHTML = "Searching...";

    if (searchInput === "") {
        mealList.innerHTML = "Please enter a meal name or ingredients to search!";
        return;
    }

    const userIngredients = searchInput.split(',').map(ingredient => ingredient.trim().toLowerCase());
    console.log('User Ingredients:', userIngredients);

    getDocs(mealsRef).then((snapshot) => {
        const matchedMeals = [];

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

                  
// Add onclick function to the save button in your generated HTML
// Update your HTML generation function as shown below:
html += `
    <div class="meal-item" data-id="${meal.id}" data-ingredients="${meal.strIngredients || ''}">
        <div class="meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="meal-name">
            <h3>${meal.strMeal}</h3>
            ${starsHtml}
            <p style="color: ${percentageColor};">Ingredients Match: ${meal.matchPercentage}%</p>
            <span class="like-btn" data-id="${meal.id}">
                <i class="fa fa-heart-o" aria-hidden="true"></i>
            </span> 
            <span class="save-btn" data-id="${meal.id}" onclick="saveToFavorites('${meal.id}')">
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
                html = `Sorry, no meals found for "${searchInput}"!`;
            }
        } else {
            html = "No meals in the database!";
        }

        mealList.innerHTML = html;

        const mealItems = document.querySelectorAll('.meal-item');
        mealItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const mealDetails = item.querySelector('.meal-details');
                mealDetails.style.display = mealDetails.style.display === 'block' ? 'none' : 'block';
                e.stopPropagation();
            });
        });

    }).catch((error) => {
        console.error('Error fetching meals:', error);
        mealList.innerHTML = "Error fetching meals.";
    });
}