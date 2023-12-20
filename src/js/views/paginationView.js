import View from "./View";
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    addHandlerClick(handler) {
        this._parentElement.addEventListener("click", function(e) {
           const button = e.target.closest('.btn--inline');

           if (!button) return;

           const gotoPage = +button.dataset.goto;
           handler(gotoPage);
        });
    }

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.page;
        let markup = "";

        // Displays back button if after page 1
        if (currentPage > 1) {
            markup += `
            <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            `;

        }
        // Displays next button if before the last page
        if (currentPage < numPages) {
            markup += `
            <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
        }
        return markup;
    }
}

export default new PaginationView();