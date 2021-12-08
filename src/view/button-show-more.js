import {createElement} from '../render.js';

const createButtonShowMore = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createButtonShowMore();
  }

  removeElement() {
    this.#element = null;
  }
}
