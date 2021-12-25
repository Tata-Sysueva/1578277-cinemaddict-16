import AbstractView from './abstract-view';
import {render} from '../render';
import CommentPopupView from './comment-view';
import {generateComment} from '../mock/comment';

const COMMENT_STATE_COUNT = 4;

const comments = Array.from({length: COMMENT_STATE_COUNT}, generateComment);

const createCommentsContainer = () => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${COMMENT_STATE_COUNT}</span></h3>

    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentsContainerView extends AbstractView {
  #commentsList = null;

  constructor() {
    super();

    this.#commentsList = this.element.querySelector('.film-details__comments-list');
    comments.forEach((comment) => render(this.#commentsList, new CommentPopupView(comment)));

    return this.element;
  }

  get template() {
    return createCommentsContainer();
  }
}
