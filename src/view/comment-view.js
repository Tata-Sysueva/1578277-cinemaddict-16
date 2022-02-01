import AbstractView from './abstract-view';
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
        <button class="film-details__comment-delete" type="button">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class CommentPopupView extends AbstractView {
  #commentInfo = null;

  constructor(commentInfo) {
    super();
    this.#commentInfo = commentInfo;
  }

  get template() {
    return createComment(this.#commentInfo);
  }

  setOnDeleteCommentClick = (cb) => {
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', () => cb(this.#commentInfo.id));
  }
}
