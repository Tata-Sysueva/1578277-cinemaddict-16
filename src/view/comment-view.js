import AbstractView from './abstract-view';
import {UpdateType, UserAction} from '../const';
import dayjs from 'dayjs';

const createComment = (textComment) => {
  const {author, date, comment, emotion} = textComment;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class CommentPopupView extends AbstractView {
  #commentInfo = null;
  #callback = null;
  #userAction = null;
  #updateType = null;

  constructor(commentInfo, callbackCommentInfo) {
    super();
    this.#commentInfo = commentInfo;
    this.#callback = callbackCommentInfo;

    this.setDeleteComment(callbackCommentInfo);
  }

  get template() {
    return createComment(this.#commentInfo);
  }

  setDeleteComment = () => {
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#deleteClickHandler);
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();

    this.#userAction = UserAction.DELETE_COMMENT;
    this.#updateType = UpdateType.PATCH;
    this.#callback(this.#userAction, this.#updateType, this.#commentInfo.id);
  }
}
