import SmartView from './smart-view';

const createPopupReactionsTemplate = ({ userDetails }) => (
  `<section class="film-details__controls">
    <button
       type="button"
       class="film-details__control-button ${userDetails.watchlist ? 'film-details__control-button--active' : ' '} film-details__control-button--watchlist"
       id="watchlist"
       name="watchlist"
       >
        Add to watchlist
    </button>
    <button
       type="button"
       class="film-details__control-button ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ' '} film-details__control-button--watched"
       id="watched"
       name="watched"
       >
        Already watched
    </button>
    <button
       type="button"
       class="film-details__control-button ${userDetails.favorite ? 'film-details__control-button--active' : ' '} film-details__control-button--favorite"
       id="favorite"
       name="favorite"
       >
        Add to favorites
    </button>
  </section>`
);

export default class PopupReactionsView extends SmartView {
  #callback = null;

  constructor(films, callback) {
    super();
    this.#callback = callback;
    this._data = PopupReactionsView.parseFilmsToData(films);
    this.#setInnerHandlers(callback);
  }

  get template() {
    return createPopupReactionsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers(this.#callback);
  }

  #setInnerHandlers = (callback) => {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#onHistoryClick);
  }

  #onHistoryClick = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
    this.updateData({
      userDetails: {...this._data.userDetails, alreadyWatched: !this._data.userDetails.alreadyWatched}
    })
  };

  static parseFilmsToData = (film) => ({...film,
    userDetails: {...film.userDetails, alreadyWatched: film.userDetails.alreadyWatched}
  });
}
