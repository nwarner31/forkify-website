import { async } from 'regenerator-runtime';

import {API_URL, API_KEY, RESULTS_PER_PAGE, BOOKMARKS_PER_PAGE} from "./config";
import { ajax } from "./helpers";

export const state = {
    recipe: { },
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: {
        full: [],
        results:[],
        searchTerm: "",
        page: 1,
        resultsPerPage: BOOKMARKS_PER_PAGE
    },
};

const createRecipeObject = function(data) {
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        bookmarked: state.bookmarks.full.some(bookmark => bookmark.id === recipe.id),
        ...(recipe.key && {key: recipe.key})
    }
}

export const loadRecipe = async function(id) {
    try {
        const data = await ajax(`${API_URL}${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);
    } catch (err) {
        throw err;
    }
};

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await ajax(`${API_URL}?search=${query}&key=${API_KEY}`);

        this.state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && {key: recipe.key})
            }
        })
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
};

export const getSearchResultsPage =  function(page = state.search.page) {
    state.search.page = page;
    const startOfPage = (page - 1) * RESULTS_PER_PAGE;
    const endOfPage = startOfPage + RESULTS_PER_PAGE;
    return state.search.results.slice(startOfPage, endOfPage);
};

export const updateServings = function(newServings) {
    state.recipe.ingredients = state.recipe.ingredients.map(ingredient => {
        const newQuantity = ingredient.quantity * (newServings / state.recipe.servings);
        return {...ingredient, quantity: newQuantity};
    });
    state.recipe.servings = newServings;
};

export const addBookmark = function(recipe) {
    // Add bookmark
    state.bookmarks.full.push(recipe);
    if (recipe.title.toLowerCase().includes(state.bookmarks.searchTerm)) {
        state.bookmarks.results.push(recipe);
        state.bookmarks.page = 1;
    }


    // Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBoomarks();
};

export const deleteBookmark = function(id) {
    state.bookmarks.full = state.bookmarks.full.filter(recipe => recipe.id !== id);
    state.bookmarks.results = state.bookmarks.results.filter(recipe => recipe.id !== id);
    state.bookmarks.page = 1;

    // Mark current recipe as bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBoomarks();
}

const persistBoomarks = function() {
    localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks.full));
}

export const filterBookmarks = function(term) {
    state.bookmarks.searchTerm = term;
    state.bookmarks.page = 1;
    if (term === "")  {
        state.bookmarks.results = state.bookmarks.full.slice();
        return;
    }
    state.bookmarks.results = state.bookmarks.full.filter(recipe => recipe.title.toLowerCase().includes(term.toLowerCase())
    );
}

export const getBookmarkResultPage = function(page = state.bookmarks.page) {
    state.bookmarks.page = page;
    const startOfPage = (page - 1) * BOOKMARKS_PER_PAGE;
    const endOfPage = startOfPage + BOOKMARKS_PER_PAGE;
    return state.bookmarks.results.slice(startOfPage, endOfPage);
}

const init = function() {
    const storage = localStorage.getItem("bookmarks");
    if (storage) {
        state.bookmarks.full = JSON.parse(storage);
        filterBookmarks(state.bookmarks.searchTerm);
    }

}

init();

const clearBookmarks = function() {
    localStorage.clear("bookmarks");
}

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].includes("ingredient") && entry[1].trim() !== "")
            .map(ingredient => {
                const ingredientArray = ingredient[1].split(",");
                if(ingredientArray.length !== 3)
                    throw new Error("Wrong ingredient format! Please use the correct format :)");

                const [quantity, unit, description] = ingredientArray
                return { quantity: quantity ? +quantity : null, unit, description };
            });

        const recipe = {
          title: newRecipe.title,
          source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients
        };
        console.log(recipe);
        const data = await ajax(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }

}

export const getSearchQueries = function(text) {
    return availableSearchQueries.filter(query => query.includes(text));
}

const availableSearchQueries = [
    "carrot",
    "broccoli",
    "asparagus",
    "cauliflower",
    "corn",
    "cucumber",
    "green pepper",
    "lettuce",
    "mushrooms",
    "onion",
    "potato",
    "pumpkin",
    "red pepper",
    "tomato",
    "beetroot",
    "brussel sprouts",
    "peas",
    "zucchini",
    "radish",
    "sweet potato",
    "artichoke",
    "leek",
    "cabbage",
    "celery",
    "chili",
    "garlic",
    "basil",
    "coriander",
    "parsley",
    "dill",
    "rosemary",
    "oregano",
    "cinnamon",
    "saffron",
    "green bean",
    "bean",
    "chickpea",
    "lentil",
    "apple",
    "apricot",
    "avocado",
    "banana",
    "blackberry",
    "blackcurrant",
    "blueberry",
    "boysenberry",
    "cherry",
    "coconut",
    "fig",
    "grape",
    "grapefruit",
    "kiwifruit",
    "lemon",
    "lime",
    "lychee",
    "mandarin",
    "mango",
    "melon",
    "nectarine",
    "orange",
    "papaya",
    "passion fruit",
    "peach",
    "pear",
    "pineapple",
    "plum",
    "pomegranate",
    "quince",
    "raspberry",
    "strawberry",
    "watermelon",
    "salad",
    "pizza",
    "pasta",
    "popcorn",
    "lobster",
    "steak",
    "bbq",
    "pudding",
    "hamburger",
    "pie",
    "cake",
    "sausage",
    "tacos",
    "kebab",
    "poutine",
    "seafood",
    "chips",
    "fries",
    "masala",
    "paella",
    "som tam",
    "chicken",
    "toast",
    "marzipan",
    "tofu",
    "ketchup",
    "hummus",
    "chili",
    "maple syrup",
    "parma ham",
    "fajitas",
    "champ",
    "lasagna",
    "poke",
    "chocolate",
    "croissant",
    "arepas",
    "bunny chow",
    "pierogi",
    "donuts",
    "rendang",
    "sushi",
    "ice cream",
    "duck",
    "curry",
    "beef",
    "goat",
    "lamb",
    "turkey",
    "pork",
    "fish",
    "crab",
    "bacon",
    "ham",
    "pepperoni",
    "salami",
    "ribs"
]