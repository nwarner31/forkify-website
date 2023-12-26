import View from "./View";


class QueryHintView extends View {
    _parentElement = document.querySelector(".query-hints");

    _generateMarkup() {
        if (this._data === "nothing") return "";

        return this._data.map(hint => `
        <li value="${hint}">${hint}</li>
        `).join("");
    }

    addHandlerSelectTerm(handler) {
        this._parentElement.addEventListener("click", (event) => {
            const item = event.target.closest("li");
            if (!item) return;
            handler(item.innerText);
        });
    }
}

export default new QueryHintView();