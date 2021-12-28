import AbstractView from './abstract-view.js';

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
};

const createSortTemplate = () => (
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button" data-sort-type="${SortType.DEFAULT}">
        Sort by default
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">
        Sort by date
      </a>
    </li>
    <li>
      <a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">
        Sort by rating
      </a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #sortButtons = null;

  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    this.#sortButtons = this.element.querySelectorAll('.sort__button');
    this.#sortButtons.forEach((sortButton) => sortButton.classList.remove('sort__button--active'))

    console.log(evt.target);
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    evt.target.classList.add('sort__button--active');
  }
}
