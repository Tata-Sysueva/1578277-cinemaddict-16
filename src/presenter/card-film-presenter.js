import CardFilmView from '../view/card-film-view';
import { remove, render, replace } from '../render';
import PopupView from '../view/popup-view';
import { isEscapeKey, isPressedEvent } from '../utils';
import {Mode, UpdateType, UserAction} from '../const';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class CardFilmPresenter {
  #container = null;
  #film = null;
  #filmComponent = null;
  #popup = null;
  #changeData = null;
  #filterType = null;
  #commentsModel = null;
  #changePopupData = null;
  #changeMode = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, filterType, changePopupData, commentsModel, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#filterType = filterType;
    this.#changePopupData = changePopupData;
    this.#commentsModel = commentsModel;
    this.#changeMode = changeMode;
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
      this.#popup = new PopupView(
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
    this.#mode = Mode.DEFAULT;
    this.#changeMode = null;
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleClosePopup();
    }
  }

  setViewState = (state, commentId) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#popup.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#popup.updateData({
          isDisabled: true,
          isDeleting: false,
        });
        break;
      case State.DELETING:
        this.#popup.updateData({
          isDisabled: true,
          isDeleting: true,
          commentId,
        });
        break;
      case State.ABORTING:
        this.#popup.shake(resetFormState);
        break;
    }
  }

  #renderPopup = (film, comments, deleteComment, scrollPosition) => {
    this.#mode = Mode.OPENING;
    this.#changeMode();
    this.#popup = new PopupView(
      film,
      this.#handleControlsClick,
      comments,
      deleteComment,
    );

    this.#popup.setOnCloseButtonClick(this.#handleClosePopup);

    render(document.body, this.#popup);
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#onPopupEscKeydown);
    document.addEventListener('keydown', this.#onPressedDown);

    this.#popup.scrollPopup(scrollPosition);
  }

  #handleClosePopup = () => {
    remove(this.#popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscKeydown);
    document.removeEventListener('keydown', this.#onPressedDown);
  };

  #onPopupEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#handleClosePopup();
    }
  }

  #onPressedDown = (evt) => {
    if (isPressedEvent(evt)) {
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

  #handleControlsClick = (updatedDetails, activeControl) => {
    const position = this.#popup.scrollTopOffset;

    this.#changeData(
      activeControl === this.#filterType ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film, userDetails: {...updatedDetails}},
      position,
    );
  }

  #handleControlsFilmsClick = (updatedDetails, activeControl) => {
    const position = this.#popup.scrollTopOffset;

    this.#changeData(
      activeControl === this.#filterType ? UpdateType.MINOR : UpdateType.PATCH,
      {...this.#film, ...updatedDetails},
      position,
    );
  }

  #handleDeleteComment = (commentId) => {
    const position = this.#popup?.scrollTopOffset || 0;

    this.#changePopupData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, film: this.#film },
      position,
    );
  }
}
