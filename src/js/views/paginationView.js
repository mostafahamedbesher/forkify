import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    //we use event delegation to handle clicks on pagination buttons, so we add the listner on their parent
    this._parentElement.addEventListener('click', e => {
      if (
        e.target
          ?.closest('.btn--inline')
          .classList.contains('pagination__btn--next')
      ) {
        this._data.page++;
        handler();
      }

      if (
        e.target
          ?.closest('.btn--inline')
          .classList.contains('pagination__btn--prev')
      ) {
        this._data.page--;
        handler();
      }
    });
  }

  _generateMarkup() {
    const maxPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(maxPages);

    return `${
      this._data.page !== 1
        ? `<button class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.page - 1}</span>
  </button>`
        : ''
    }
    ${
      this._data.page !== maxPages
        ? `<button class="btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`
        : ''
    }
  `;
  }
}

export default new PaginationView();
