class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearResult();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  _clearResult() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
