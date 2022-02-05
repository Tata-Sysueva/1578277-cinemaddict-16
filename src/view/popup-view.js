import SmartView from './smart-view';
import {BLANK_COMMENT, ControlType, EMOJIS, FilterType} from '../const';
import dayjs from 'dayjs';
import he from 'he';

const createPopupButtonClose = () => (
  `<div class="film-details__close">
    <button class="film-details__close-btn" type="button">close</button>
  </div>`
);

const createFilmInfoTemplate = ({ filmInfo }) => {
  const runTime = filmInfo.runtime;

  const runTimeHour = Math.floor(runTime/60);
  const runTimeMinutes = Math.round(runTime - (runTimeHour * 60));

  return `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${filmInfo.poster}" alt="${filmInfo.title}">

      <p class="film-details__age">${filmInfo.ageRating}+</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">

        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${filmInfo.title}</h3>
          <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${filmInfo.totalRating}</p>
        </div>

      </div>

      <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${filmInfo.director}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${filmInfo.writers}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${filmInfo.actors}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${filmInfo.release.date.getFullYear()}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${ runTimeHour }h ${ runTimeMinutes }m</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">${ filmInfo.genres.length > 1 ? 'Genres' : 'Genre' }</td>
        <td class="film-details__cell">
          ${filmInfo.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
        </td>
      </tr>
    </table>

      <p class="film-details__film-description">
      ${filmInfo.description}
    </p>
    </div>
  </div>`;
};

const createPopupReactionsTemplate = ({ userDetails }) => (`
  <section class="film-details__controls">
    <button
       type="button"
       class="film-details__control-button ${userDetails.watchlist ? 'film-details__control-button--active' : ' '} film-details__control-button--watchlist"
       id="watchlist"
       name="watchlist"
       >
        Add to watchlist
    </button>
    <button
       type="button"
       class="film-details__control-button ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ' '} film-details__control-button--watched"
       id="watched"
       name="watched"
       >
        Already watched
    </button>
    <button
       type="button"
       class="film-details__control-button ${userDetails.favorite ? 'film-details__control-button--active' : ' '} film-details__control-button--favorite"
       id="favorite"
       name="favorite"
       >
        Add to favorites
    </button>
  </section>`
);

const createComment = ({ id, author, date, comment, emotion }, isDisabled, isDeleting, commentId) => {
  const isDeletingComment = commentId === id;

  return (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).format('YYYY/MM/DD HH:mm')}</span>
          <button
            class="film-details__comment-delete"
            type="button"
            id="${id}"
            ${isDeletingComment && isDisabled ? 'disabled' : ''}
          >
            ${isDeletingComment && isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`
  );
};

const createCommentsContainer = (comments, isDisabled, isDeleting, commentId) => (`
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">
      Comments
      <span class="film-details__comments-count">${comments.length}</span>
    </h3>
    <ul class="film-details__comments-list">
      ${comments.map((comment) => createComment(comment, isDisabled, isDeleting, commentId)).join('')}
    </ul>
  </section>`
);

const createEmojiList = (activeEmotion, isDisabled) => (`
  <div class="film-details__emoji-list">
    ${EMOJIS.map((emoji) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${emoji === activeEmotion ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join('')}
  </div>`
);

const createNewComment = ({ text, emotion }, isDisabled) => (`
  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </div>

    <label class="film-details__comment-label">
      <textarea
        class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment-text"
        ${isDisabled ? 'disabled' : ''}
      >
        ${he.encode(text)}
      </textarea>
    </label>

    ${createEmojiList(emotion, isDisabled)}
  </div>`
);

const createPopupTemplate = (data, comments) => (`<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        ${createPopupButtonClose()}
        ${createFilmInfoTemplate(data)}
        ${createPopupReactionsTemplate(data)}
      </div>
      <div class="film-details__bottom-container">
        ${createCommentsContainer(comments, data.isDisabled, data.isDeleting, data.commentId)}
        ${createNewComment({text: data.text, emotion: data.emotion}, data.isDisabled)}
      </div>
    </form>
  </section>`
);

export default class PopupView extends SmartView {
  #film = null;
  #callback = null;
  #comments = null;

  constructor(film, controlsCallback, comments, deleteComment) {
    super();
    this.#film = film;
    this.#callback = controlsCallback;
    this.#comments = comments;

    this._data = PopupView.parseFilmsToData(film, BLANK_COMMENT);

    this.#setInnerHandlers(deleteComment);
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments);
  }

  get scrollTopOffset() {
    return this.element.scrollTop;
  }

  scrollPopup = (scrollPosition) => {
    this.element.scrollTo(0, scrollPosition);
  }

  getFormData = () => {
    const formPopup = this.element.querySelector('.film-details__inner');

    return new FormData(formPopup);
  };

  setOnCloseButtonClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#onCloseButtonClick);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = (callback) => {
    this._callback.clickDelete = callback;

    this.element.querySelector('.film-details__controls')
      .addEventListener('click', this.#onControlsClick);

    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((emojiInput) => emojiInput.addEventListener('click', this.#emojiClickHandler));

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textInputHandler);

    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((deleteButton) => deleteButton
        .addEventListener('click', this.#onDeleteCommentClick));
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
    this.#film = null;
  }

  #onDeleteCommentClick = (evt) => {
    this._callback.clickDelete(evt.target.id);
  }

  #onControlsClick = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    let activeControl;
    let userDetails;

    switch (evt.target.id) {
      case ControlType.WATCHLIST:
        activeControl = FilterType.WATCHLIST;
        userDetails = {...this._data.userDetails, watchlist: !this._data.userDetails.watchlist};
        break;
      case ControlType.WATCHED:
        activeControl = FilterType.HISTORY;
        userDetails = {...this._data.userDetails, alreadyWatched: !this._data.userDetails.alreadyWatched};
        break;
      case ControlType.FAVORITE:
        activeControl = FilterType.FAVORITES;
        userDetails = {...this._data.userDetails, favorite: !this._data.userDetails.favorite};
        break;
      default:
        throw new Error(`Unknown control type: ${evt.target.id}`);
    }

    this.#callback({...this._data, ...userDetails}, activeControl);
  };

  #emojiClickHandler = (evt) => {
    this.updateData({
      ...this._data,
      emotion: evt.target.value,
    });
  }

  #textInputHandler = (evt) => {
    this.updateData({
      ...this._data,
      text: evt.target.value
    }, true);
  }

  static parseFilmsToData = (film) => ({
    ...film,
    ...BLANK_COMMENT,
    isDisabled: false,
    isDeleting: false,
    commentId: null,
  });
}
