import { render } from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupControlsView from './popup-reactions-view';
import CommentsContainerView from './comments-container-view';
import NewCommentView from './new-comment-view';
import SmartView from './smart-view';

const createPopupTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container"></div>
      <div class="film-details__bottom-container"></div>
    </form>
  </section>`
);

export default class PopupContainerView extends SmartView {
  #film = null;
  #topContainer = null;
  #bottomContainer = null;

  constructor(film, controlsCallback, comments, deleteComment) {
    super();
    this.#film = film;

    this.#topContainer = this.element.querySelector('.film-details__top-container');
    this.#bottomContainer = this.element.querySelector('.film-details__bottom-container');

    render(this.#topContainer, new PopupButtonCloseView());
    render(this.#topContainer, new PopupFilmInfoView(this.#film));
    render(this.#topContainer, new PopupControlsView(this.#film.userDetails, controlsCallback));

    render(this.#bottomContainer, new CommentsContainerView(comments, deleteComment));
    render(this.#bottomContainer, new NewCommentView());
  }

  get template() {
    return createPopupTemplate();
  }

  get scrollTopOffset() {
    return this.element.scrollTop;
  }

  scrollPopup = (scrollPosition) => {
    this.element.scrollTo(0, scrollPosition);
  }

  getFormData = () => {
    const formPopup = this.element.querySelector('.film-details__inner');

    return new FormData(formPopup);
  };

  setOnCloseButtonClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#onCloseButtonClick);
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
    this.#film = null;
    this.#topContainer = null;
    this.#bottomContainer = null;
  }
}
