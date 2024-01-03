import Fraction from 'fractional';

import icons from 'url:../../img/icons.svg';
import View from "./View";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = "Recipe was successfully uploaded";
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _buttonOpen = document.querySelector(".nav__btn--add-recipe");
    _buttonClose = document.querySelector(".btn--close-modal");



    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        this._overlay.addEventListener("click", () => {
            this.closeWindow();
        });
       this._setupEvents();
    }
    _setupEvents() {
        this._ingredientContainer = document.querySelector(".ingredient-container");
        document.getElementById("ar-ai-button").addEventListener("click", () => {
            console.log("add clicked");
            this._addIngredientRow();
        });
        this._ingredientContainer.addEventListener("click", (event) => {
            const deleteInput = event.target.closest(".upload__delete-button");
            if (!deleteInput) return;
            deleteInput.parentElement.parentElement.remove();
        });
    }
    _addHandlerShowWindow() {
        this._buttonOpen.addEventListener("click", (function() {
            this._overlay.classList.remove("hidden");
            this._window.classList.remove("hidden");
        }).bind(this));
    }

    closeWindow() {
        this._overlay.classList.add("hidden");
        this._window.classList.add("hidden");
        // Resets the form. Timeout is to allow it to close before the reset)
        setTimeout(() => {
            this.resetForm();
        }, 300)

    }

    _addHandlerHideWindow() {
        this._buttonClose.addEventListener("click", (function() {
            this.closeWindow();
        }).bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        })
    }

    resetForm() {
        this._parentElement.innerHTML = this._formMarkup;
        this._setupEvents();
    }

    _addIngredientRow() {
        const ingredientInputs = this._ingredientContainer.querySelectorAll("input");
        console.log(ingredientInputs[ingredientInputs.length-1]);
        const newId = +ingredientInputs[ingredientInputs.length-1].getAttribute("controlid") + 1;
        this._ingredientContainer.insertAdjacentHTML("beforeend", `
            <div class="upload__row">
                <input controlid="${newId}" name="ingredient-${newId}">
                    <div class="upload__delete" >
                        <button type="button" class="upload__delete-button">X</button>
                    </div>
            </div>
        `)
    }

    _generateMarkup() {
    }

    _formMarkup = `
    <div class="upload__body">
            <h3 class="upload__heading">Recipe data</h3>

            <div class="upload__container-row">
                <div class="upload__row">
                    <label class="upload__label">Title</label><input name="title">
                </div>
                <div class="upload__row">
                    <label class="upload__label">URL</label><input name="sourceUrl">
                </div>
                <div class="upload__row">
                    <label class="upload__label">Image URL</label><input name="image">
                </div>
                <div class="upload__row">
                    <label class="upload__label">Publisher</label><input name="publisher">
                </div>
                <div class="upload__row">
                    <label class="upload__label">Prep Time</label><input name="cookingTime">
                </div>
                <div class="upload__row">
                    <label class="upload__label">Servings</label><input name="servings">
                </div>
            </div>

            <div class="upload__container">
                <h3 class="upload__heading">Ingredients</h3>
                <div class="upload__add">
                    <button type="button" id="ar-ai-button">Add</button>
                </div>
            </div>

            <div class="upload__container-row ingredient-container">
                <div class="upload__row">
                    <input class="ingredient-input" controlid="1" placeholder="Format: 'Quantity,Unit,Description'" name="ingredient-1">
                    <div class="upload__delete"></div>
                </div>

            </div>
        </div>
        <button class="btn upload__btn">
            <svg>
                <use href="${icons}#icon-upload-cloud"></use>
            </svg>
            <span>Upload</span>
        </button>`;

}

export default new AddRecipeView();