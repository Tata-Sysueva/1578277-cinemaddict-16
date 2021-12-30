import {render} from '../render';
import PopupButtonCloseView from './popup-button-close-view';
import PopupFilmInfoView from './popup-film-info-view';
import PopupReactionsView from './popup-reactions-view';
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

  constructor(film, callback) {
    super();
    this.#film = film;

    this.#topContainer = this.element.querySelector('.film-details__top-container');
    this.#bottomContainer = this.element.querySelector('.film-details__bottom-container');

    render(this.#topContainer, new PopupButtonCloseView());
    render(this.#topContainer, new PopupFilmInfoView(this.#film));
    render(this.#topContainer, new PopupReactionsView(this.#film, callback));

    render(this.#bottomContainer, new CommentsContainerView());
    render(this.#bottomContainer, new NewCommentView());
  }

  get template() {
    return createPopupTemplate();
  }

  setOnCloseButtonClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseButtonClick);
  }

  #onCloseButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setOnFilmWatchListClick = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#onWatchListClick);
  }

  // setOnHistoryClick = (callback) => {
  //   this._callback.historyClick = callback;
  //   this.element.querySelector('.film-details__control-button--watched')
  //     .addEventListener('click', this.#onHistoryClick);
  // }

  setOnFavoriteClick = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#onFavoriteClick);
  }

  #onWatchListClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #onHistoryClick = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  }

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
