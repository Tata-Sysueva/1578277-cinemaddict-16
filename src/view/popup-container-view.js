import {render} from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupControlsView from './popup-controls-view';
import CommentsContainerView from './popup-comments-view';
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
  #commentsModel = null;

  constructor(film, controlsCallback, commentsModel, callbackCommentInfo) {
    super();
    this.#film = film;
    this.#commentsModel = commentsModel;

    this.#topContainer = this.element.querySelector('.film-details__top-container');
    this.#bottomContainer = this.element.querySelector('.film-details__bottom-container');

    render(this.#topContainer, new PopupButtonCloseView());
    render(this.#topContainer, new PopupFilmInfoView(this.#film));
    render(this.#topContainer, new PopupControlsView(this.#film.userDetails, controlsCallback));

    render(this.#bottomContainer, new CommentsContainerView(this.#film, this.#commentsModel, callbackCommentInfo));
    render(this.#bottomContainer, new NewCommentView());
  }

  get template() {
    return createPopupTemplate();
  }

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
