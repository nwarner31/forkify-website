import View from "./View";
import previewView from "./previewView";

class BookmarksView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = " No bookmarks yet. Find a nice recipe and bookmark it :)";
    _message = "";

    constructor() {
        super();
        const navButton = document.querySelector(".nav__btn--bookmarks");
        for (let element of [navButton, this._parentElement.parentElement]) {
            element.addEventListener("mouseenter", () => {
                this._parentElement.parentElement.style.opacity = "1";
                this._parentElement.parentElement.style.visibility = "visible";
            });
            element.addEventListener("mouseleave", () => {
                this._parentElement.parentElement.style.opacity = "0";
                this._parentElement.parentElement.style.visibility = "hidden";
            });
        }
        this._parentElement.addEventListener("click", () => {
            this._parentElement.parentElement.style.opacity = "0";
            this._parentElement.parentElement.style.visibility = "hidden";
        });
    }

    addHandlerRender(handler) {
        window.addEventListener("load", handler);
    }

    _generateMarkup() {
        return this._data.map(bookmark => previewView.render(bookmark, false)).join("");
    }
}

export default new BookmarksView();