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

    _generateMarkup() {
    }

}

export default new AddRecipeView();