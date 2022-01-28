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

  updateFilms = async (film) => {
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
      'date': film.date instanceof Date ? film.date.toISOString() : null,
      'release_country': film.releaseCountry,
    };

    const filmInfo = {
      'title': film.title,
      'alternative_title': film.alternativeTitle,
      'total_rating': film.totalRating,
      'poster': film.poster,
      'age_rating': film.ageRating,
      'director': film.director,
      'writers': film.writers,
      'actors': film.actors,
      'release': release,
      'runtime': film.runtime,
      'genre': film.genres,
      'description': film.description,
    };

    const userDetails = {
      'watchlist': film.watchlist,
      'already_watched': film.alreadyWatched,
      'watching_date': film.watchingDate,
      'favorite': film.favorite,
    };

    const adaptedFilm = {...film,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.release;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genres;
    delete adaptedFilm.description;
    delete adaptedFilm.watchlist;
    delete adaptedFilm.alreadyWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.favorite;

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
