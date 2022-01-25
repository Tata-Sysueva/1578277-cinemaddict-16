import {uppercaseFirstLetter} from '../utils';
import AbstractView from './abstract-view';

const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
      href="#${type}"
      class="main-navigation__item
      ${type === currentFilterType ? 'main-navigation__item--active' : ' '}"
      id="${type}"
    >
    ${uppercaseFirstLetter(name)}
    ${type === 'all' ? ' ' :
      `<span class="main-navigation__item-count">
       ${count}
      </span>`
    }
  </a>`
  );
};

const createSiteMenuTemplate = (filmsFilter, currentFilterType) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filmsFilter.map((filter) => createFilterTemplate(filter, currentFilterType)).join('')}
    </div>
    <a href="#stats" class="main-navigation__additional${currentFilterType === 'stats' ? ' main-navigation__additional--active' : '' }">Stats</a>
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
    const filterItems = this.element.querySelector('.main-navigation__items');
    filterItems.addEventListener('click', this.#filterTypeClickHandler);
  };

  #filterTypeClickHandler = (evt) => {
    evt.preventDefault();

    const navigationItemElement = evt.target.closest('a.main-navigation__item');

    if (!navigationItemElement) {
      return;
    }

    this._callback.filterTypeChange(evt.target.id);
  }

  setStatsElementClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    const statsElement = this.element.querySelector('.main-navigation__additional');
    statsElement.addEventListener('click', this.#statsElementClickHandler);
  }

  #statsElementClickHandler = (evt) => {
    evt.preventDefault();
    const href = evt.target.getAttribute('href').slice(1);
    this._callback.filterTypeChange(href);
  }
}
