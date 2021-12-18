import {createElement, renderElement} from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupReactionsView from './popup-reactions-view';
import CommentsContainerView from './popup-comments-view';
import NewCommentView from './new-comment-view';
import AbstractView from './abstract-view';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container"></div>
      <div class="film-details__bottom-container"></div>
    </form>
  </section>`
);

export default class PopupContainerView extends AbstractView {
  #element = null;
  #film = null;
  #topContainer = null;
  #bottomContainer = null;
  #closeButton = null;


  constructor(film) {
    super();
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#topContainer = this.#element.querySelector('.film-details__top-container');
    this.#bottomContainer = this.#element.querySelector('.film-details__bottom-container');
    this.#closeButton = new PopupButtonCloseView().element;

    renderElement(this.#topContainer, this.#closeButton);
    renderElement(this.#topContainer, new PopupFilmInfoView(this.#film).element);
    renderElement(this.#topContainer, new PopupReactionsView(this.#film).element);

    renderElement(this.#bottomContainer, new CommentsContainerView().element);
    renderElement(this.#bottomContainer, new NewCommentView().element);

    return this.#element;
  }

  get template() {
    return createPopupTemplate();
  }

  setOnCloseButtonClick = (callback) => {
    this._callback.click = callback;
    this.#closeButton.addEventListener('click', this.#onCloseButtonClick);
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this.#closeButton = null;
    this._callback.click();
  }
}
