import AbstractView from './abstract-view';
import {getCommentArray} from '../mock/comment';
import CommentPopupView from './comment-view';
import {render} from '../render';
import {getValues} from '../utils';

const createCommentsContainer = ({ comments }) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentsContainerView extends AbstractView {
  #commentsList = null;
  #film = null;
  #commentsId = null;
  #commentsInfo = null;

  #addComment = null;
  #deleteComment = null;

  constructor(film, commentsInfo) {
    super();
    this.#film = film;
    this.#commentsInfo = commentsInfo;

    this.#renderCommentsList();
    return this.element;
  }

  get template() {
    return createCommentsContainer(this.#film);
  }

  #renderCommentsList = () => {
    this.#commentsId = this.#film.comments;

    this.#commentsList = this.element.querySelector('.film-details__comments-list');
    this.#commentsId.forEach((commentId) => {
        render(this.#commentsList, new CommentPopupView(getValues(this.#commentsInfo, commentId)))
      }
    );
  }
}
