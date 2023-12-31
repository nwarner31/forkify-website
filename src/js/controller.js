
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import {bookmarkPaginationView, searchPaginationView} from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";
import queryHintView from './views/queryHintView';
import bookmarkSearchView from "./views/bookmarkSearchView";

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
        bookmarksView.update(model.getBookmarkResultPage());
        //bookmarkPaginationView.render(model.state.bookmarks);

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
        searchPaginationView.render(model.state.search);
    } catch (err) {

    }
};

const controlAddBookmark = function() {
    // 1) Add/remove bookmark
    console.log(model.state.recipe.bookmarked);
    if (!model.state.recipe.bookmarked) {
        if (model.state.bookmarks.full.length === 0) showBookmarkSearchView();
        model.addBookmark(model.state.recipe);

    }
     else if (model.state.recipe.bookmarked) {
         model.deleteBookmark(model.state.recipe.id);
         if (model.state.bookmarks.full.length === 0) bookmarkSearchView.render(-1);
    }

     // 2) Update recipe view
    recipeView.update(model.state.recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.getBookmarkResultPage());
    bookmarkPaginationView.render(model.state.bookmarks);
}

const controlPagination = function(gotoPageNumber) {
    resultsView.render(model.getSearchResultsPage(gotoPageNumber));

    searchPaginationView.render(model.state.search);
}

const controlServings = function(newServings) {
    // Update the servings (in state)
    model.updateServings(newServings)

    // Update the recipe view
    recipeView.update(model.state.recipe);
}

const controlBookmarks = function() {
    bookmarksView.render(model.getBookmarkResultPage());

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
        bookmarksView.render(model.getBookmarkResultPage());

        // Change ID in URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);
    } catch (err) {
        console.log(err);
        addRecipeView.renderError(err.message);
        // Close Modal
        setTimeout(function() {
            addRecipeView.closeWindow();

        }, MODAL_CLOSE_SEC * 1000);

    }

}

const controlSearchQueryTerms = function(text) {
    let availableTerms = [];
    if (text) availableTerms = model.getSearchQueries(text);
    // To prevent the View render from displaying an error message and instead display nothing
    if (availableTerms.length === 0) availableTerms = "nothing";
    // This small delay allows for the click event to take place before the elements dissapear
    setTimeout(_ => {
        queryHintView.render(availableTerms);
    }, 200);

}

const controlSelectQueryTerm = function(term) {
    searchView.updateSearchTerm(term);
}

const controlBookmarkSearchTerm = function(term) {
    model.filterBookmarks(term);
    console.log(model.state.bookmarks.results);
    console.log(term);
    bookmarksView.render(model.getBookmarkResultPage());
    bookmarkPaginationView.render(model.state.bookmarks);
}

const controlBookmarkPagination = function(gotoPageNumber) {
    bookmarksView.render(model.getBookmarkResultPage(gotoPageNumber));

    bookmarkPaginationView.render(model.state.bookmarks);
}

const showBookmarkSearchView = function() {
    bookmarkSearchView.render(model.state.bookmarks.full.length);
    bookmarkSearchView.addHandlerSearchTerm(controlBookmarkSearchTerm);
    bookmarkSearchView.init();
    bookmarkPaginationView.render(model.state.bookmarks);
}

const init = function() {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    searchPaginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);

    searchView.addHandlerSearchHelper(controlSearchQueryTerms);
    queryHintView.addHandlerSelectTerm(controlSelectQueryTerm);
    bookmarkPaginationView.addHandlerClick(controlBookmarkPagination);
    if (model.state.bookmarks.full.length > 0) showBookmarkSearchView();
}

init();



