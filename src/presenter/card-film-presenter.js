import CardFilmView from '../view/card-film-view';
import {remove, render, replace} from '../render';
import PopupContainerView from '../view/popup-container-view';
import {isEscapeKey} from '../utils';
import {UpdateType} from '../const.js';
import CommentsModel from '../model/comments-model';
import {getCommentArray} from '../mock/comment';

export default class CardFilmPresenter {
  #container = null;
  #film = null;
  #filmComponent = null;
  #popup = null;
  #changeData = null;
  #filterType = null;
  #commentsModel = null;
  #comments = null;

  constructor(container, changeData, filterType) {
    this.#container = container;
    this.#changeData = changeData;
    this.#filterType = filterType;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setOnFilmControlsClick(this.#handleControlsFilmsClick)

    this.#comments = getCommentArray();
    this.#commentsModel = new CommentsModel();
    this.#commentsModel.comments = this.#comments;

    this.#filmComponent.setOnPopupClick(() => this.#renderPopup(film, this.#comments));

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  #renderPopup = (film, comments) => {
    this.#popup = new PopupContainerView(film, this.#handleControlsClick, comments);

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

  #handleViewAction = (updateType, date) => {
    this.#comments.addComment(updateType, date);
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
