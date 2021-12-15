import AbstractView from './abstract-view';
import {createElement, renderElement} from '../render';
import CommentPopupView from './comment-view';
import {generateComment} from '../mock/comment';

const COMMENT_STATE_COUNT = 4;

const comments = Array.from({length: COMMENT_STATE_COUNT}, generateComment);

const createCommentsContainer = () => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentsContainerView extends AbstractView {
  #element = null;
  #commentsList = null;

  constructor() {
    super();
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#commentsList = this.#element.querySelector('.film-details__comments-list');
    comments.forEach((comment) => renderElement(this.#commentsList, new CommentPopupView(comment).element));

    return this.#element;
  }

  get template() {
    return createCommentsContainer();
  }
}
