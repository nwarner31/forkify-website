import View from "./View";


class BookmarkSearchView extends View {
    _parentElement = document.querySelector(".bookmark-search");
    _generateMarkup() {
        // Return empty string if no bookmarks because there are none to search through
        if (this._data < 1) return "";
        return `
        <input type="text" placeholder="Search Bookmarks" class="search__field" >
        <button type="button" class="btn" >Clear</button>
        `;
    }

    addHandlerSearchTerm(handler) {
        this._parentElement.querySelector("input").addEventListener("input", (event) => {
            if (event.target.value.trim().length < 3) {
                handler("");
                return;
            }
            handler(event.target.value);
        });
    }

    init() {
        this._parentElement.querySelector("button").addEventListener("click", () => {
            const input = this._parentElement.querySelector("input");
            input.value = "";
            input.dispatchEvent(new Event("input"));

        })
    }
}

export default new BookmarkSearchView();