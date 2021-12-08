import {createElement} from '../render';

const createCardFilm = (filmInfo) => {
  const {
    title,
    rating,
    image,
    duration,
    year,
    genre,
    description,
    comments,
    watchlist,
    alreadyWatched,
    favorite,
  } = filmInfo;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}h ${duration}m</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${image}" alt="${title}" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments}</span>
    </a>
    <div class="film-card__controls">
      <button
        class="film-card__controls-item ${watchlist ? 'film-card__controls-item--active' : ' '} film-card__controls-item--add-to-watchlist"
        type="button"
        >
        Add to watchlist
      </button>
      <button
        class="film-card__controls-item ${alreadyWatched ? 'film-card__controls-item--active' : ' '} film-card__controls-item--mark-as-watched"
        type="button"
        >
        Mark as watched
      </button>
      <button
        class="film-card__controls-item ${favorite ? 'film-card__controls-item--active' : ' '} film-card__controls-item--favorite"
        type="button"
        >
        Mark as favorite
      </button>
    </div>
  </article>`;
};

export default class CardFilmView {
  #element = null;
  #filmInfo = null;

  constructor(filmInfo) {
    this.#filmInfo = filmInfo;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCardFilm(this.#filmInfo);
  }

  removeElement() {
    this.#element = null;
  }
}
