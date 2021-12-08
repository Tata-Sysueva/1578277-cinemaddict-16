import {createElement} from '../render';

const createFilmsTemplate = (title, isExtra = true) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ' '}">
    <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ' '}">${title}</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsView {
  #element = null;
  #title = null;
  #isExtra = null;

  constructor(title, isExtra) {
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsTemplate(this.#title, this.#isExtra);
  }

  removeElement() {
    this.#element = null;
  }
}
