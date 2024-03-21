import View from './view';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupBookmark).join('');
  }

  _generateMarkupBookmark(bookmark) {
    const curId = window.location.hash.slice(1);

    return `<li class="preview">
    <a class="preview__link ${
      curId === bookmark.id ? 'preview__link--active' : ''
    }" href="#${bookmark.id}">
      <figure class="preview__fig">
        <img src=${bookmark.image} alt="${bookmark.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${bookmark.title} ...</h4>
        <p class="preview__publisher">${bookmark.publisher}</p>
        <div class="preview__user-generated ${bookmark.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>`;
  }
}

export default new BookmarksView();
