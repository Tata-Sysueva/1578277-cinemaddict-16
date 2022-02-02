import AbstractView from './abstract-view';
import CommentPopupView from './comment-popup-view';
import { render } from '../render';

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
  #comments = null;
  #deleteComment = null;

  constructor(comments, deleteComment) {
    super();
    this.#comments = comments;
    this.#deleteComment = deleteComment;

    this.#renderCommentsList();
  }

  get template() {
    return createCommentsContainer(this.#comments.length);
  }

  #renderCommentsList = () => {
    const commentsList = this.element.querySelector('.film-details__comments-list');
    this.#comments.forEach((comment) => {
      const commentInstance = new CommentPopupView(comment);
      render(commentsList, commentInstance);
      commentInstance.setOnDeleteCommentClick(this.#deleteComment);
    });
  }
}
