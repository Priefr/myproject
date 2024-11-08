// apiHandler.js
// Call the function to fetch and save meals

async function fetchAndSaveData() {
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='; // MealDB API URL
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Log the entire data response to inspect its structure
        console.log('API Response:', data);

        // Check if meals are found
        if (data && data.meals) {
            // Assuming data.meals is an array of meal objects
            for (const meal of data.meals) {
                // Store meal data in Firestore
                await setDoc(doc(db, 'meals', meal.idMeal), meal);
            }
            console.log('Data successfully saved to Firestore');
        } else {
            console.log('No meals found for the specified search term.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to execute it
fetchAndSaveData();
// Fetch data from API and save to Firestore

async function fetchDataFromApi() {
  const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'; 
  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.meals;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

async function saveDataToFirestore(meals) {
  const db = firebase.firestore();
  
  meals.forEach(async (meal) => {
      try {
          await db.collection('meals').add({
              idMeal: meal.idMeal,
              strMeal: meal.strMeal,
              strCategory: meal.strCategory,
              strArea: meal.strArea,
              strInstructions: meal.strInstructions,
              strMealThumb: meal.strMealThumb,
              ingredients: extractIngredients(meal) 
          });
          console.log(`Meal ${meal.strMeal} added to Firestore`);
      } catch (error) {
          console.error('Error writing document: ', error);
      }
  });
}

function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient) {
          ingredients.push(ingredient);
      }
  }
  return ingredients;
}

export async function fetchAndSaveMeals() {
  const meals = await fetchDataFromApi();
  if (meals) {
      saveDataToFirestore(meals);
  }
}
