import {createElement} from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupReactionsView from './popup-reactions-view';
import CommentsContainerView from './popup-comments-view';
import NewCommentView from './new-comment-view';
import {generateComment} from '../mock/comment';
import CommentPopupView from './comment-view';

const COMMENT_STATE_COUNT = 4;

const comments = Array.from({length: COMMENT_STATE_COUNT}, generateComment);

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
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    this._topContainer = this.#element.querySelector('.film-details__top-container');
    this._bottomContainer = this.#element.querySelector('.film-details__bottom-container');

    this._topContainer.append(new PopupButtonCloseView().element);
    this._topContainer.append(new PopupFilmInfoView(this.#film).element);
    this._topContainer.append(new PopupReactionsView(this.#film).element);

    this._bottomContainer.append(new CommentsContainerView().element);
    comments.forEach((comment) => this._bottomContainer.append(new CommentPopupView(comment).element));
    this._bottomContainer.append(new NewCommentView().element);

    return this.#element;
  }

  get template() {
    return createPopupTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
