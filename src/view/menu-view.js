import { createElement } from '../render';
import { uppercaseFirstLetter } from '../util';

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

export default class MenuView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteMenuTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
