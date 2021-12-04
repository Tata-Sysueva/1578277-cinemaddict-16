import {createElement} from '../render';

const createPopupReactionsTemplate = (cardsFilms) => {
  const {
    watchlist,
    alreadyWatched,
    favorite,
  } = cardsFilms;

  return `<section class="film-details__controls">
    <button
       type="button"
       class="film-details__control-button ${watchlist ? 'film-details__control-button--active' : ' '} film-details__control-button--watchlist"
       id="watchlist"
       name="watchlist"
       >
        Add to watchlist
    </button>
    <button
       type="button"
       class="film-details__control-button ${alreadyWatched ? 'film-details__control-button--active' : ' '} film-details__control-button--watched"
       id="watched"
       name="watched"
       >
        Already watched
    </button>
    <button
       type="button"
       class="film-details__control-button ${favorite ? 'film-details__control-button--active' : ' '} film-details__control-button--favorite"
       id="favorite"
       name="favorite"
       >
        Add to favorites
    </button>
  </section>`;
};

export default class PopupReactionsView {
  #element = null;
  #cardsFilms = null;

  constructor(cardsFilms) {
    this.#cardsFilms = cardsFilms;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopupReactionsTemplate(this.#cardsFilms);
  }

  removeElement() {
    this.#element = null;
  }
}
