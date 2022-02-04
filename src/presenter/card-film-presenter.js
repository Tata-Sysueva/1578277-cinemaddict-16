import CardFilmView from '../view/card-film-view';
import { remove, render, replace } from '../render';
import PopupContainerView from '../view/popup-container-view';
import { isEscapeKey, isPressedEvent } from '../utils';
import { Mode, UpdateType, UserAction } from '../const';

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
    this.#mode = Mode.DEFAULT;
    this.#changeMode = null;
  }

  #renderPopup = (film, comments, deleteComment, scrollPosition) => {
    this.#mode = Mode.OPENING;
    this.#changeMode();
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
    document.addEventListener('keydown', this.#onPressedDown);

    this.#popup.scrollPopup(scrollPosition);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleClosePopup();
    }
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
