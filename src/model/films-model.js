import AbstractObservable from '../abstract-observable';
import {UpdateType} from '../const';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  get films() {
    return this.#films;
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updateFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }

  #adaptToClient = (film) => {
    const release = {
      date: film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : film['film_info']['release']['date'],
      releaseCountry: film['film_info']['release']['release_country'],
    };

    const filmInfo = {
      title: film['film_info']['title'],
      alternativeTitle: film['film_info']['alternative_title'],
      totalRating: film['film_info']['total_rating'],
      poster: film['film_info']['poster'],
      ageRating: film['film_info']['age_rating'],
      director: film['film_info']['director'],
      writers: film['film_info']['writers'],
      actors: film['film_info']['actors'],
      release: release,
      genres: film['film_info']['genre'],
      runtime: film['film_info']['runtime'],
      description: film['film_info']['description'],
    };

    const userDetails = {
      watchlist: film['user_details']['watchlist'],
      alreadyWatched: film['user_details']['already_watched'],
      watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
      favorite: film['user_details']['favorite'],
    };

    const adaptedFilm = {...film,
      filmInfo,
      userDetails,
    };

    delete adaptedFilm['user_details'];
    delete adaptedFilm['film_info'];

    return adaptedFilm;
  }

//   const adaptedFilm = Object.assign(
//     {},
//     film,
//     {
//       filmInfo: {
//         title: film['film_info']['title'],
//         alternativeTitle: film['film_info']['alternative_title'],
//         totalRating: film['film_info']['total_rating'],
//         poster: film['film_info']['poster'],
//         ageRating: film['film_info']['age_rating'],
//         director: film['film_info']['director'],
//         writers: film['film_info']['writers'],
//         actors: film['film_info']['actors'],
//         release: {
//           date: film['film_info']['release']['date'],
//           releaseCountry: film['film_info']['release']['release_country'],
//         },
//         runTime: film['film_info']['runtime'],
//         genres: film['film_info']['genre'],
//         description: film['film_info']['description'],
//       },
//       userDetails: {
//         watchlist: film['user_details']['watchlist'],
//         alreadyWatched: film['user_details']['already_watched'],
//         watchingDate: film['user_details']['watching_date'],
//         favorite: film['user_details']['favorite'],
//       },
//     });
//
//   delete adaptedFilm['film_info'];
//   delete adaptedFilm['user_details'];
//
//   return adaptedFilm;
// }
}
