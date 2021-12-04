import {createElement} from '../render';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container"></div>
      <div class="film-details__bottom-container"></div>
    </form>
  </section>`
);

export default class PopupContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
