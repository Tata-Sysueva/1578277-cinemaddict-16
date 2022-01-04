import pluralize from 'pluralize';
import AbstractView from './abstract-view';
import SmartView from './smart-view';

const createCardFilm = ({ comments, filmInfo, userDetails }) => (
  `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmInfo.release.date}</span>
        <span class="film-card__duration">${filmInfo.runtime}h ${filmInfo.runtime}m</span>
        <span class="film-card__genre">${filmInfo.genre}</span>
      </p>
      <img src="./images/posters/${filmInfo.poster}" alt="${filmInfo.title}" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}</p>
      <span class="film-card__comments">${comments.length} ${pluralize('comment', comments.length)}</span>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item ${userDetails.watchlist ? 'film-card__controls-item--active' : ' '} film-card__controls-item--add-to-watchlist"
        type="button"
        >
        Add to watchlist
      </button>
      <button
        class="film-card__controls-item ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ' '} film-card__controls-item--mark-as-watched"
        type="button"
        >
        Mark as watched
      </button>
      <button
        class="film-card__controls-item ${userDetails.favorite ? 'film-card__controls-item--active' : ' '} film-card__controls-item--favorite"
        type="button"
        >
        Mark as favorite
      </button>
    </div>
  </article>`
);

export default class CardFilmView extends SmartView {
  #filmInfo = null;
  #callback = null;

  constructor(filmInfo, callbackControls) {
    super();
    this.#filmInfo = filmInfo;
    this.#callback = callbackControls;
    this._data = CardFilmView.parseFilmsToData(filmInfo);
    this.#setOnFilmControlsClick(callbackControls);
  }

  get template() {
    return createCardFilm(this._data);
  }

  restoreHandlers = () => {
    this.#setOnFilmControlsClick(this.#callback);
  }

  setOnPopupClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onPopupClick);
  }

  #onPopupClick = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName !== 'BUTTON') {
      this._callback.click();
    }
  }

  #setOnFilmControlsClick = (callbackControls) => {
    this._callback.controlsClick = callbackControls;
    this.element.addEventListener('click', this.#onControlsClick);
  }

  #onControlsClick = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-card__controls-item')) {
      return;
    }

    switch (evt.target) {
      case evt.target.closest('.film-card__controls-item--add-to-watchlist'):
        this._data = {...this._data, watchlist: !this._data.watchlist};
        break;
      case evt.target.closest('.film-card__controls-item--mark-as-watched'):
        this._data = {...this._data, alreadyWatched: !this._data.alreadyWatched};
        break;
      case evt.target.closest('.film-card__controls-item--favorite'):
        this._data = {...this._data, favorite: !this._data.favorite};
        break;
      default:
        this._data = {...this._data};
    }

    this.updateData({
      userDetails: {...this._data}
    });

    this._callback.controlsClick(this._data);
  }

  static parseFilmsToData = (filmDetails) => ({...filmDetails});
}
