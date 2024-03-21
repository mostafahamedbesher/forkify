import { API_URL, KEY, RES_PER_PAGE } from './config';
import { getJson, sendJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}?key=${KEY}`);

    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   image: recipe.image_url,
    //   ingredients: recipe.ingredients,
    //   publisher: recipe.publisher,
    //   servings: recipe.servings,
    //   sourceUrl: recipe.source_url,
    //   title: recipe.title,
    //   cookingTime: recipe.cooking_time,
    // };

    //change recipe object format
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
};

export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}&key=${KEY}`);

    const { recipes } = data.data;
    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search.results);
    //reset page number while re-search for another recipe
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  //store current page in the state
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    const quantityPerOne = ing.quantity / state.recipe.servings;
    //update quantity
    ing.quantity = quantityPerOne * newServings;
  });
  //update servings
  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  // console.log('index', index);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
}

export function localSaveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
}

//for testing only
function clearBookmarks() {
  localStorage.clear('bookmarks');
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = [];
    for (const [key, value] of Object.entries(newRecipe)) {
      if (key.includes('ingredient') && value !== '') {
        //convert every ingredient to object of(quantity,unit,description)
        const valueArr = value.split(',');
        const valueObj = {
          quantity: Number(valueArr.at(0)) || null,
          unit: valueArr.at(1) || '',
          description: valueArr.at(2) || '',
        };
        //put all ingredients in an array
        ingredients.push(valueObj);
      }
    }

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: Number(newRecipe.servings) || 1,
      ingredients,
      cooking_time: Number(newRecipe.cookingTime),
    };

    const data = await sendJson(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    //bookmark our uploaded recipe
    addBookmark(state.recipe);
  } catch (err) {
    console.error(err);
  }
}

init();
