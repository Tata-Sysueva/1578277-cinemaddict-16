import CardFilmView from '../view/card-film-view';
import { remove, render, replace } from '../render';
import PopupContainerView from '../view/popup-container-view';
import { isCtrlEnterEvent, isEscapeKey } from '../utils';
import { UpdateType, UserAction } from '../const';

export default class CardFilmPresenter {
  #container = null;
  #film = null;
  #filmComponent = null;
  #popup = null;
  #changeData = null;
  #filterType = null;
  #commentsModel = null;
  #changePopupData = null;

  constructor(container, changeData, filterType, changePopupData, commentsModel) {
    this.#container = container;
    this.#changeData = changeData;
    this.#filterType = filterType;
    this.#changePopupData = changePopupData;
    this.#commentsModel = commentsModel;
  }

  init = (film, position) => {
    const scrollPosition = position || 0;

    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popup;

    this.#filmComponent = new CardFilmView(film);
    this.#filmComponent.setOnFilmControlsClick(this.#handleControlsFilmsClick);

    this.#filmComponent.setOnPopupClick(async () => {
      await this.#commentsModel.init(film);
      this.#renderPopup(film, this.#commentsModel.comments, this.#handleDeleteComment, scrollPosition);
    });

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmComponent);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (prevPopupComponent !== null && document.body.contains(prevPopupComponent.element)) {
      this.#popup = new PopupContainerView(
        film,
        this.#handleControlsClick,
        this.#commentsModel.comments,
        this.#handleDeleteComment,
      );

      replace(this.#popup, prevPopupComponent);
      this.#popup.scrollPopup(scrollPosition);
      this.#popup.setOnCloseButtonClick(this.#handleClosePopup);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #renderPopup = (film, comments, deleteComment, scrollPosition) => {
    this.#popup = new PopupContainerView(
      film,
      this.#handleControlsClick,
      comments,
      deleteComment,
    );

    this.#popup.setOnCloseButtonClick(this.#handleClosePopup);

    render(document.body, this.#popup);
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#onPopupEscKeydown);
    document.addEventListener('keydown', this.#onCtrlEnterDown);

    this.#popup.scrollPopup(scrollPosition);
  }

  #handleClosePopup = () => {
    remove(this.#popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscKeydown);
    document.removeEventListener('keydown', this.#onCtrlEnterDown);
  };

  #onPopupEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#handleClosePopup();
    }
  }

  #onCtrlEnterDown = (evt) => {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();

      if (this.#popup) {
        const formData = this.#popup.getFormData();
        const position = this.#popup.scrollTopOffset;

        const newComment = {
          comment: formData.get('comment-text'),
          emotion: formData.get('comment-emoji'),
        };

        const filmId = this.#film.id;

        this.#changePopupData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          { filmId, newComment },
          position,
        );
      }
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

  #handleDeleteComment = (commentId) => {
    const position = this.#popup ? this.#popup.scrollTopOffset : 0;

    this.#changePopupData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, film: this.#film },
      position,
    );
  }
}
