import {createElement} from '../render';

const createPopupButtonClose = () =>(
  `<div class="film-details__close">
    <button class="film-details__close-btn" type="button">close</button>
  </div>`
);

export default class PopupButtonCloseView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupButtonClose();
  }

  removeElement() {
    this.#element = null;
  }
}
