import AbstractObservable from '../abstract-observable';
import { UpdateType } from '../const';
import { adaptToClient } from '../utils';

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
      this.#films = films.map(adaptToClient);
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
      const updateFilm = adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error(`Can't update film. Error ${err}`);
    }
  }
}
