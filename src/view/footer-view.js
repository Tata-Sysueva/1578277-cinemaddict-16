import {createElement} from '../render';

const createFooterTemplate = (filmsCounter) => {
  const {countAllFilms} = filmsCounter;

  return `<section class="footer__statistics">
      <p>${countAllFilms} movies inside</p>
    </section>`;
};

export default class FooterView {
  #element = null;
  #counter = null;

  constructor(counter) {
    this.#counter = counter;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterTemplate(this.#counter);
  }

  removeElement() {
    this.#element = null;
  }
}
