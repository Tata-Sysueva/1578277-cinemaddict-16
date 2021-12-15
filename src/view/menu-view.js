import {uppercaseFirstLetter} from '../utils';
import AbstractView from './abstract-view';

const createFilterTemplate = (name,count) => (
  `<a href="${name}" class="main-navigation__item">
    ${uppercaseFirstLetter(name)}
    <span class="main-navigation__item-count">
      ${count}
    </span>
  </a>`
);

const createSiteMenuTemplate = (filmsFilter) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>

      ${Object.entries(filmsFilter).map(([name, count]) => createFilterTemplate(name, count)).join('')}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters);
  }
}
