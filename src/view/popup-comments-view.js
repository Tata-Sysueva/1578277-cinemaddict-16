import {createElement} from '../render.js';

const createCommentsContainer = () => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentsContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentsContainer();
  }

  removeElement() {
    this.#element = null;
  }
}
