
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";
import { MODAL_CLOSE_SEC } from "./config";
import {state} from "./model";

// if (module.hot) {
//     model.hot.accept();
// }

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);
        if(!id) return;
        recipeView.renderSpinner();
        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());
        bookmarksView.update(model.state.bookmarks);

        // 1) Loading recipe
        await model.loadRecipe(id);

        // 2) Rendering recipe
        recipeView.render(model.state.recipe);

    } catch (err) {
        recipeView.renderError();
        console.error(err)
    }

};

const controlSearchResults = async function() {
    try {
        resultsView.renderSpinner();
        // 1) Get search query
        const query = searchView.getQuery();
        if(!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);

        // 3) Render results
        resultsView.render(model.getSearchResultsPage());

        // 4) Render pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {

    }
};

const controlAddBookmark = function() {
    // 1) Add/remove bookmark
    console.log(model.state.recipe.bookmarked);
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
     else if (model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);

     // 2) Update recipe view
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlPagination = function(gotoPageNumber) {
    resultsView.render(model.getSearchResultsPage(gotoPageNumber));

    paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
    console.log(newServings);
    // Update the servings (in state)
    model.updateServings(newServings)

    // Update the recipe view
    recipeView.update(model.state.recipe);
}

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    console.log(newRecipe);

    try {
        // Show loading spinner
        addRecipeView.renderSpinner();

        // Upload new recipe data
        await model.uploadRecipe(newRecipe);

        // Show new recipe
        recipeView.render(model.state.recipe);

        // Display success message
        recipeView.renderMessage();

        // Close Modal
        setTimeout(function() {
            addRecipeView.closeWindow();
        }, MODAL_CLOSE_SEC * 1000);

        // Render bookmarks
        bookmarksView.render(model.state.bookmarks);

        // Change ID in URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);
    } catch (err) {
        console.log(err);
        addRecipeView.renderError(err.message);
    }

}

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();



