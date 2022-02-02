import SmartView from './smart-view';
import { ControlType, FilterType } from '../const';

const createPopupReactionsTemplate = (userDetails) => (
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
  #userAction = null;

  constructor(filmDetails, callback) {
    super();
    this.#callback = callback;
    this._data = PopupReactionsView.parseFilmsToData(filmDetails);
    this.#setInnerHandlers(callback);
  }

  get template() {
    return createPopupReactionsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.addEventListener('click', this.#onControlsClick);
  }

  #onControlsClick = (evt) => {
    evt.preventDefault();

    if (!evt.target.closest('.film-details__control-button')) {
      return;
    }

    switch (evt.target.id) {
      case ControlType.WATCHLIST:
        this.#userAction = FilterType.WATCHLIST;
        this._data = {...this._data, watchlist: !this._data.watchlist};
        break;
      case ControlType.WATCHED:
        this.#userAction = FilterType.HISTORY;
        this._data = {...this._data, alreadyWatched: !this._data.alreadyWatched};
        break;
      case ControlType.FAVORITE:
        this.#userAction = FilterType.FAVORITES;
        this._data = {...this._data, favorite: !this._data.favorite};
        break;
      default:
        this._data = {...this._data};
    }

    this.updateData({
      userDetails: {...this._data}
    });

    this.#callback(this._data, this.#userAction);
  };

  static parseFilmsToData = (filmDetails) => ({...filmDetails});
}
