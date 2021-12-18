import CardFilmView from '../view/card-film-view';
import {removeElement, renderElement} from '../render';
import FilmsContainerView from '../view/films-container-view';
import PopupContainerView from '../view/popup-container-view';
import {isEscapeKey} from '../utils';

export  default class CardFilmPresenter {
  #container = null;
  #filmCard = null;
  #popup = null;

  #filmsContainer = new FilmsContainerView().element;

  #filmsInfo = [];

  constructor(container) {
    this.#container = container;
  }

  init = (filmsInfo) => {
    this.#filmsInfo = [...filmsInfo];

    renderElement(this.#container, this.#filmsContainer);

    this.#renderCards();
  }

  #renderPopup = (film) => {
    this.#popup = new PopupContainerView(film);

    renderElement(document.body, this.#popup.element );
    document.body.classList.add('hide-overflow');

    const closePopup = () => {
      removeElement(this.#popup);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onPopupEscKeydown);
    }

    function onPopupEscKeydown(evt) {
      if (isEscapeKey(evt)) {
        closePopup();
      }
    }

    this.#popup.setOnCloseButtonClick(() => closePopup());
    document.addEventListener('keydown', onPopupEscKeydown);
  };


  #renderCards = () => {
    this.#filmsInfo.forEach((film) => {
      this.#filmCard = new CardFilmView(film);
      renderElement(this.#filmsContainer, this.#filmCard.element);

      this.#filmCard.setOnPopupClick(() => this.#renderPopup(film));
      this.#filmCard.setOnFilmWatchedCheck(() => console.log('watched'));
    })
  }
}
