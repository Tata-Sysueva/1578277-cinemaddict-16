import pluralize from 'pluralize';
import AbstractView from './abstract-view';

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

export default class CardFilmView extends AbstractView {
  #filmInfo = null;
  #userAction = null;

  constructor(filmInfo) {
    super();
    this.#filmInfo = filmInfo;
  }

  get template() {
    return createCardFilm(this.#filmInfo);
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

  setOnFilmControlsClick = (callbackControls) => {
    this._callback.controlsClick = callbackControls;
    this.element.addEventListener('click', this.#onControlsClick);
  }

  #onControlsClick = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-card__controls')) {
      return;
    }

    switch (evt.target) {
      case evt.target.closest('.film-card__controls-item--add-to-watchlist'):
        //this.#userAction = UserAction.ADD_FILM_TO_WATCHLIST;
        this.#filmInfo = {...this.#filmInfo,
          userDetails: {
            ...this.#filmInfo.userDetails,
            watchlist: !this.#filmInfo.userDetails.watchlist
          }
        };
        break;
      case evt.target.closest('.film-card__controls-item--mark-as-watched'):
        //this.#userAction = UserAction.MARK_FILM_AS_WATCHED;
        this.#filmInfo = {...this.#filmInfo,
          userDetails: {
            ...this.#filmInfo.userDetails,
            alreadyWatched: !this.#filmInfo.userDetails.alreadyWatched
          }
        };
        break;
      case evt.target.closest('.film-card__controls-item--favorite'):
        //this.#userAction = UserAction.MARK_FILM_AS_FAVORITE;
        this.#filmInfo = {...this.#filmInfo,
          userDetails: {
            ...this.#filmInfo.userDetails,
            favorite: !this.#filmInfo.userDetails.favorite
          }
        };
        break;
      default:
        this.#filmInfo = {...this.#filmInfo};
    }

    this._callback.controlsClick(this.#filmInfo, this.#userAction);
  }
}

