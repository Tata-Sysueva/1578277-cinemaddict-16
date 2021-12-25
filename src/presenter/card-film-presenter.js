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
    const prevPopupComponent = this.#popup;

    this.#popup = new PopupContainerView(film);

    this.#popup.setOnCloseButtonClick(this.#closePopup);
    this.#popup.setOnFilmWatchListClick(this.#handleAddWatchListClick);
    this.#popup.setOnHistoryClick(this.#handleHistoryClick);
    this.#popup.setOnFavoriteClick(this.#handleFavoriteClick);

    if (prevPopupComponent === null) {
      render(document.body, this.#popup);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onPopupEscKeydown);
    } else {
      this.#closePopup();
    }

    remove(prevPopupComponent);
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

  #handleAddWatchListClick = () => {
    this.#changeData({...this.#film, watchlist: !this.#film.watchlist});
  }

  #handleHistoryClick = () => {
    this.#changeData({...this.#film, alreadyWatched: !this.#film.alreadyWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, favorite: !this.#film.favorite});
  }
}
