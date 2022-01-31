import AbstractView from './abstract-view';
import CommentPopupView from './comment-view';
import {render} from '../render';

const createCommentsContainer = (comments) => (
  `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">
        Comments
        <span class="film-details__comments-count">${comments}</span>
    </h3>

    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentsContainerView extends AbstractView {
  #commentsList = null;
  #film = null;
  #comment = null;
  #commentsInfo = null;

  constructor(film, commentsInfo, callbackCommentInfo) {
    super();
    this.#film = film;
    this.#commentsInfo = commentsInfo;

    this.#renderCommentsList(callbackCommentInfo);
    return this.element;
  }

  get template() {
    return createCommentsContainer(this.#commentsInfo.length);
  }

  #renderCommentsList = (callbackCommentInfo) => {
    this.#commentsList = this.element.querySelector('.film-details__comments-list');
    this.#commentsInfo.forEach((comment) => {
      this.#comment = new CommentPopupView(comment);
      render(this.#commentsList,this.#comment);
      this.#comment.setDeleteComment(callbackCommentInfo);
    });
  }
}
