import { uppercaseFirstLetter } from '../utils';
import AbstractView from './abstract-view';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (`
    <a
      href="#${type}"
      class="main-navigation__item
      ${type === currentFilterType ? 'main-navigation__item--active' : ' '}"
      id="${type}"
    >
      ${uppercaseFirstLetter(name)}
      ${!count ? ' ' :
      `<span class="main-navigation__item-count">
       ${count}
      </span>`
    }
    </a>`
  );
};

const createSiteMenuTemplate = (filmsFilter, currentFilterType) => (`
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${filmsFilter.map((filter) => createFilterTemplate(filter, currentFilterType)).join('')}
    </div>
    <a href="#stats" id="stats" class="main-navigation__additional${currentFilterType === 'stats' ? ' main-navigation__additional--active' : '' }">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeClickHandler);
  };

  #filterTypeClickHandler = (evt) => {
    const filterItem = evt.target.closest('a');

    if (!filterItem) {
      return;
    }

    evt.preventDefault();

    const filterItemHref = filterItem.getAttribute('href')?.slice?.(1);
    this._callback.filterTypeChange(filterItemHref);
  }
}
