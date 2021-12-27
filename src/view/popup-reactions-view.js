import AbstractView from './abstract-view';

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

export default class PopupReactionsView extends AbstractView {
  #cardsFilms = null;

  constructor(cardsFilms) {
    super();
    this.#cardsFilms = cardsFilms;
  }

  get template() {
    return createPopupReactionsTemplate(this.#cardsFilms);
  }
}
