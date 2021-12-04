import {createElement} from '../render';

const createFilmInfoTemplate = (cardsFilms) => {
  const {
    title,
    rating,
    image,
    duration,
    genres,
    description,
    age,
    director,
    actors,
    writers,
    country,
    date,
  } = cardsFilms;

  return `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="./images/posters/${image}" alt="${title}">

      <p class="film-details__age">${age}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${title}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
    </div>

    <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${date}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${duration}h ${duration}m</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${country}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
          ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
        </td>
      </tr>
    </table>

    <p class="film-details__film-description">
      ${description}
    </p>
  </div>`;
};

export default class PopupFilmInfoView {
  #element = null;
  #cardsFilms = null;

  constructor(cardsFilms) {
    this.#cardsFilms = cardsFilms;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmInfoTemplate(this.#cardsFilms);
  }

  removeElement() {
    this.#element = null;
  }
}
