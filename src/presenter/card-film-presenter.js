import CardFilmView from '../view/card-film-view';
import {remove, render, replace} from '../render';
import PopupContainerView from '../view/popup-container-view';
import {isEscapeKey} from '../utils';

export default class CardFilmPresenter {
  #container = null;
  #film = null;
  #filmComponent = null;
  #popup = null;
  #changeData = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new CardFilmView(film);

    this.#filmComponent.setOnFilmWatchListClick(this.#handleAddWatchListClick);
    this.#filmComponent.setOnHistoryClick(this.#handleHistoryClick);
    this.#filmComponent.setOnFavoriteClick(this.#handleFavoriteClick);
    this.#filmComponent.setOnPopupClick(() => this.#renderPopup(film));

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  #renderPopup = (film) => {
    this.#popup = new PopupContainerView(film, this.#handleControlsClick);

    this.#popup.setOnCloseButtonClick(this.#closePopup);
    //this.#popup.setOnFilmWatchListClick(this.#handleAddWatchListClick);
    // this.#popup.setOnHistoryClick(this.#handleHistoryClick);
    // this.#popup.setOnFavoriteClick(this.#handleFavoriteClick);

    render(document.body, this.#popup);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeydown);
  }

  #closePopup = () => {
    remove(this.#popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscKeydown);
  };

  #onPopupEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#closePopup();
    }
  }

  #handleControlsClick = (updatedDetails) => {
    this.#changeData({...this.#film, userDetails: {...updatedDetails}});
  }

  #handleAddWatchListClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  }

  #handleHistoryClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched},});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  }
}
