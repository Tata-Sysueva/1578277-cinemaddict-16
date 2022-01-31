import CardFilmView from '../view/card-film-view';
import {remove, render, replace} from '../render';
import PopupContainerView from '../view/popup-container-view';
import {isEscapeKey} from '../utils';
import {UpdateType} from '../const.js';
import CommentsModel from '../model/comments-model';
import ApiService from '../api-service';

const AUTHORIZATION = 'Basic c4320a4476d34d4bba63f4c6c2d65bdc';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export default class CardFilmPresenter {
  #container = null;
  #film = null;
  #filmComponent = null;
  #popup = null;
  #changeData = null;
  #filterType = null;
  #commentsModel = null;
  #userAction = null;

  constructor(container, changeData, filterType, userAction) {
    this.#container = container;
    this.#changeData = changeData;
    this.#filterType = filterType;
    this.#userAction = userAction;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setOnFilmControlsClick(this.#handleControlsFilmsClick);

    this.#commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

    this.#filmComponent.setOnPopupClick(async () => {
      await this.#commentsModel.init(film);
      const comments = this.#commentsModel.comments;
      this.#renderPopup(film, comments, this.userAction);
    });

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  #renderPopup = (film, comments, userAction) => {
    this.#popup = new PopupContainerView(
      film,
      this.#handleControlsClick,
      comments,
      userAction
    );

    this.#popup.setOnCloseButtonClick(this.#handleClosePopup);

    render(document.body, this.#popup);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onPopupEscKeydown);
  }

  #handleClosePopup = () => {
    remove(this.#popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscKeydown);
  };

  #onPopupEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#handleClosePopup();
    }
  }

  #handleControlsClick = (updatedDetails, userAction) => {
    this.#changeData(
      userAction === this.#filterType ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film, userDetails: {...updatedDetails}});
  }

  #handleControlsFilmsClick = (updatedDetails, userAction) => {
    this.#changeData(
      userAction === this.#filterType ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film, ...updatedDetails},
    );
  }
}
