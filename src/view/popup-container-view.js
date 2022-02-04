import { render } from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupControlsView from './popup-reactions-view';
import CommentsContainerView from './comments-container-view';
import NewCommentView from './new-comment-view';
import SmartView from './smart-view';
import {BLANK_COMMENT, ControlType, EMOJIS, FilterType} from '../const';
import CommentPopupView from './comment-popup-view';
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

      <p class="film-details__age">${filmInfo.ageRating}</p>
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

const createPopupReactionsTemplate = ({ userDetails }) => (
  `<section class="film-details__controls">
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

const createComment = ({ author, date, comment, emotion }) => (
 ` <li class="film-details__comment">
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
  </li>`
);

// const renderCommentsList = () => {
//   const commentsList = this.element.querySelector('.film-details__comments-list');
//   this.#comments.forEach((comment) => {
//     const commentInstance = new CommentPopupView(comment);
//     render(commentsList, commentInstance);
//     commentInstance.setOnDeleteCommentClick(this.#deleteComment);
//   });
// }

const createCommentsContainer = (comments) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">
      Comments
      <span class="film-details__comments-count">${comments.length}</span>
    </h3>
    <ul class="film-details__comments-list">
      ${ comments.map((comment) => createComment(comment)).join('') }
    </ul>
  </section>`
);

const createEmojiList = (activeEmotion) => (
  `<div class="film-details__emoji-list">
    ${EMOJIS.map((emoji) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${emoji === activeEmotion ? 'checked' : ''}
    >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join('')}
  </div>`
);

const createNewComment = ({ text, emotion }) => {
  return (
    `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </div>

    <label class="film-details__comment-label">
      <textarea
        class="film-details__comment-input"
        placeholder="Select reaction below and write comment here"
        name="comment-text"
      >${text}</textarea>
    </label>

    ${createEmojiList(emotion)}
  </div>`
  );
}

const createPopupTemplate = (filmInfo, infoComments) => {
  console.log(filmInfo);
  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        ${createPopupButtonClose()}
        ${createFilmInfoTemplate(filmInfo)}
        ${createPopupReactionsTemplate(filmInfo)}
      </div>
      <div class="film-details__bottom-container">
        ${createCommentsContainer(infoComments)}
        ${createNewComment(BLANK_COMMENT)}
      </div>
    </form>
  </section>`
  );
}

export default class PopupContainerView extends SmartView {
  #film = null;
  #topContainer = null;
  #bottomContainer = null;

  #callback = null;
  #userAction = null;
  #infoComments = null;
  #comments = null;

  constructor(film, controlsCallback, comments, deleteComment) {
    super();
    this.#film = film;
    this.#callback = controlsCallback;
    this.#infoComments = comments;

    this.#topContainer = this.element.querySelector('.film-details__top-container');
    this.#bottomContainer = this.element.querySelector('.film-details__bottom-container')

    // this.#comments = this.element.querySelectorAll('.film-details__comment');
    // this.#comments.forEach((comment) => comment.setOnDeleteCommentClick(deleteComment))


    //this._data = PopupControlsView.parseFilmsToData(film);

    this.#setInnerHandlers(controlsCallback);

    //render(this.#bottomContainer, new NewCommentView());
  }

  get template() {
    return createPopupTemplate(this.#film, this.#infoComments);
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

  setOnDeleteCommentClick = (cb) => {
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', () => cb(this.#infoComments.id));
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
    this.#film = null;
    this.#topContainer = null;
    this.#bottomContainer = null;
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.addEventListener('click', this.#onControlsClick);

    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((emojiInput) => emojiInput.addEventListener('click', this.#emojiClickHandler));

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textInputHandler);
  }

  #onControlsClick = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    switch (evt.target.id) {
      case ControlType.WATCHLIST:
        this.#userAction = FilterType.WATCHLIST;
        this._data = {...this._data, watchlist: !this._data.watchlist};
        break;
      case ControlType.WATCHED:
        this.#userAction = FilterType.HISTORY;
        this._data = {...this._data, alreadyWatched: !this._data.alreadyWatched};
        break;
      case ControlType.FAVORITE:
        this.#userAction = FilterType.FAVORITES;
        this._data = {...this._data, favorite: !this._data.favorite};
        break;
      default:
        this._data = {...this._data};
    }

    this.updateData({
      userDetails: {...this._data}
    });

    this.#callback(this._data, this.#userAction);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  #textInputHandler = (evt) => {
    evt.preventDefault();
    this._data = {...this._data, text: evt.target.value};
    this.updateData(this._data, true);
  }

  static parseCommentToDate = (comment) => ({...comment})

  static parseFilmsToData = (filmDetails) => ({...filmDetails});
}
