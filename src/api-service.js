const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DElETE',
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
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
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

  addComment = async (filmId, newComment) => {
    const response = await this.#load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response.json();
  }

  deleteComment = async (commentId) => await this.#load({
    url: `comments/${commentId}`,
    method: Method.DELETE,
  });

  #adaptToServer = (film) => {
    const release = {
      'date': film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null,
      'release_country': film.filmInfo.release.releaseCountry,
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
