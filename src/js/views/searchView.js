import View from "./View";


class SearchView{
    _parentElement = document.querySelector(".search");

    getQuery() {
        const query = this._parentElement.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }

    addHandlerSearch(handler) {
        this._parentElement.addEventListener("submit", function(e) {
            e.preventDefault();
            handler();
        })
    }

    addHandlerSearchHelper(handler) {
        ["input", "focus"].map(eventName => {
            this._parentElement.querySelector(".search__field").addEventListener(eventName, (event) => {
                if (event.target.value.trim().length < 3)
                {
                    handler(null);
                    return;
                }
                handler(event.target.value);
            });
        })

        this._parentElement.querySelector(".search__field").addEventListener("focusout", (event) => {
            handler(null);
        });

    }

    updateSearchTerm(searchTerm) {
        this._parentElement.querySelector(".search__field").value = searchTerm;
    }

    _clearInput() {
        this._parentElement.querySelector(".search__field").value = "";
    }
}

export default new SearchView();