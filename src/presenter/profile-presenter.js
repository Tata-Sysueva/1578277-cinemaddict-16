import {render, replace, remove} from '/src/render.js';
import {getRank} from '../utils';
import {filter} from '../filters';
import {FilterType} from '../const';
import ProfileView from '../view/profile-view';

export default class ProfilePresenter {
  #profileContainer = null;
  #filmsModel = null;
  #profileComponent = null;

  constructor(profileContainer, filmsModel) {
    this.#profileContainer = profileContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get rank() {
    const films = this.#filmsModel.films;
    const alreadyWatchedFilms = filter[FilterType.HISTORY](films).length;

    return getRank(alreadyWatchedFilms);
  }

  init = () => {
    const rank = this.rank;
    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView(rank);

    if (prevProfileComponent === null) {
      render(this.#profileContainer, this.#profileComponent);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
