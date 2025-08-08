const searchForm = document.querySelector('#recipe-form');
const searchInput = document.querySelector('#search');
const resultsContainer = document.querySelector('#results');
const loader = document.querySelector('#loader');

const API_KEY = 'f1eca391d55a4535ae0e620c6a511792';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return alert('Please enter some ingredients!');

  resultsContainer.innerHTML = '';
  loader.style.display = 'block';

  try {
    const recipes = await fetchRecipes(query);
    displayRecipes(recipes);
  } catch (error) {
    resultsContainer.innerHTML = `<p>Failed to fetch recipes. Reason: ${error.message}</p>`;
    console.error('Fetch error:', error);
  } finally {
    loader.style.display = 'none';
  }
});

async function fetchRecipes(query) {
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&includeIngredients=${encodeURIComponent(query)}&number=10&addRecipeInformation=true`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const data = await response.json();
  return data.results;
}

function displayRecipes(recipes) {
  if (!recipes.length) {
    resultsContainer.innerHTML = '<p>No recipes found. Try different ingredients.</p>';
    return;
  }

  const recipeCards = recipes.map(recipe => `
    <div class="card">
      <img src="${recipe.image}" alt="${recipe.title}">
      <div class="card-body">
        <h3>${recipe.title}</h3>
        <ul>
          ${recipe.extendedIngredients?.slice(0, 5).map(ing => `<li>${ing.original}</li>`).join('') || '<li>Ingredients unavailable</li>'}
        </ul>
        <a href="${recipe.sourceUrl}" target="_blank" class="btn">View Recipe</a>
      </div>
    </div>
  `).join('');

  resultsContainer.innerHTML = recipeCards;
}
