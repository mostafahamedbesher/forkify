import icons from 'url:../../img/icons.svg';
import View from './view';

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  // render(data) {
  //   if (!data || (Array.isArray(data) && data.length === 0)) {
  //     return this.renderError();
  //   }

  //   this._data = data;
  //   //clear previous data
  //   this._clear();
  //   //render search results
  //   data.map(recipe => {
  //     const markup = this._generateMarkup(recipe);
  //     this._parentElement.insertAdjacentHTML('afterbegin', markup);
  //   });
  // }

  /////
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(recipe) {
    const curId = window.location.hash.slice(1);

    return `<li class="preview">
    <a class="preview__link ${
      curId === recipe.id ? 'preview__link--active' : ''
    }" href="#${recipe.id}">
      <figure class="preview__fig">
        <img src=${recipe.image} alt="${recipe.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${recipe.title} ...</h4>
        <p class="preview__publisher">${recipe.publisher}</p>
        <div class="preview__user-generated ${recipe.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>`;
  }

  //////

  // _generateMarkup(recipe) {
  //   return `<li class="preview">
  //   <a class="preview__link ${
  //     curId === recipe.id ? 'preview__link--active' : ''
  //   }" href="#${recipe.id}">
  //     <figure class="preview__fig">
  //       <img src=${recipe.image} alt="${recipe.title}" />
  //     </figure>
  //     <div class="preview__data">
  //       <h4 class="preview__title">${recipe.title} ...</h4>
  //       <p class="preview__publisher">${recipe.publisher}</p>
  //     </div>
  //   </a>
  // </li>`;
  // }
}

export default new SearchResultsView();
