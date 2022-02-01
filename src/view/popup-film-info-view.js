import AbstractView from './abstract-view';

const createFilmInfoTemplate = (filmsInfo) => {
  const {
    filmInfo,
  } = filmsInfo;

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
        <td class="film-details__cell">${filmInfo.runtime}h ${filmInfo.runtime}m</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Genres</td>
        <td class="film-details__cell">
          ${filmInfo.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(' ')}
        </td>
      </tr>
    </table>

    <p class="film-details__film-description">
      ${filmInfo.description}
    </p>
  </div>`;
};

export default class PopupFilmInfoView extends AbstractView {
  #filmInfo = null;

  constructor(filmInfo) {
    super();
    this.#filmInfo = filmInfo;
  }

  get template() {
    return createFilmInfoTemplate(this.#filmInfo);
  }
}
