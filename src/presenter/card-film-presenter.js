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

    this.#filmComponent = new CardFilmView(film, this.#handleControlsClick);
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
}
