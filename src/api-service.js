const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => this.#load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `films/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const release = {
      'date': film.release.date instanceof Date ? film.release.date.toISOString() : null,
      'release_country': film.release.releaseCountry,
    };

    const filmInfo = {
      'title': film.filmInfo.title,
      'alternative_title': film.filmInfo.alternativeTitle,
      'total_rating': film.filmInfo.totalRating,
      'poster': film.filmInfo.poster,
      'age_rating': film.filmInfo.ageRating,
      'director': film.filmInfo.director,
      'writers': film.filmInfo.writers,
      'actors': film.filmInfo.actors,
      'release': release,
      'runtime': film.filmInfo.runtime,
      'genre': film.filmInfo.genres,
      'description': film.filmInfo.description,
    };

    const userDetails = {
      'watchlist': film.userDetails.watchlist,
      'already_watched': film.userDetails.alreadyWatched,
      'watching_date': film.userDetails.watchingDate,
      'favorite': film.userDetails.favorite,
    };

    const adaptedFilm = {...film,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    // delete adaptedFilm.totalRating;
    // delete adaptedFilm.poster;
    // delete adaptedFilm.ageRating;
    // delete adaptedFilm.director;
    // delete adaptedFilm.writers;
    // delete adaptedFilm.actors;
    // delete adaptedFilm.release;
    // delete adaptedFilm.runtime;
    // delete adaptedFilm.genres;
    // delete adaptedFilm.description;
    // delete adaptedFilm.watchlist;
    // delete adaptedFilm.alreadyWatched;
    // delete adaptedFilm.watchingDate;
    // delete adaptedFilm.favorite;

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
