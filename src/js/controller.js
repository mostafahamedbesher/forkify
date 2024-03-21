import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import RecipeView from './views/recipeView.js';
import searchResultsView from './views/searchResultsView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { API_URL, KEY, MODAL_CLOSE_TIME_SEC } from './config.js';
import { deleteJson } from './helpers.js';

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////

async function controlReceipe() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //render spinner
    RecipeView.renderSpinner();

    // 0) update searchResults view to mark selected recipe as active
    searchResultsView.update(
      model.getSearchResultsPage(model.state.search.page)
    );

    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Receipe
    await model.loadRecipe(id);

    // 2) Rendering Receipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    RecipeView.renderError(`${err}💥💥💥`);
  }
}

//////////////////////////////////////////////
async function controlSearchResults() {
  try {
    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    searchResultsView.renderSpinner();

    // 2) get search data
    await model.loadSearchResults(query);

    // 3) render search data & Render pagination
    controlPagination();
  } catch (err) {
    searchResultsView.renderError(`${err}💥💥💥`);
    console.error(err);
  }
}

function controlPagination() {
  // 3) render search data
  searchResultsView.render(model.getSearchResultsPage(model.state.search.page));
  // console.log(model.state.search);
  // 4) Render pagination
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //update servings
  model.updateServings(newServings);
  //update reciepe with new servings
  RecipeView.update(model.state.recipe);
}

function controlAddBookmarks() {
  //remove recipe from bookmarks if it is already bookmarked
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  } else {
    //add recipe to bookmark state
    model.addBookmark(model.state.recipe);
  }
  //save bookmarks in local storage
  model.localSaveBookmarks();

  // console.log(model.state.bookmarks);
  //update bookmark icon
  RecipeView.update(model.state.recipe);
  // add recipe item in bookmarks list
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  //show spinner
  addRecipeView.renderSpinner();
  //upload recipe
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);
  //render recipe
  RecipeView.render(model.state.recipe);
  //success message
  addRecipeView.renderMessage();
  //change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
  //close form
  setTimeout(function () {
    addRecipeView.toggleWindow();
  }, MODAL_CLOSE_TIME_SEC * 1000);
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlReceipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  RecipeView.addHandlerServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmarks);
  /////
  addRecipeView.addHandlerUpload(controlAddRecipe);
  ///
};

init();
