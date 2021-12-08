import {createElement} from '../render.js';
import FilmsView from './films-view';
import CardFilmView from './card-film-view';
import {generateCardFilm} from '../mock/film-card';
import {renderPopup} from '../main';
import ButtonShowMoreView from './button-show-more';

const CARD_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);

const createFilmsBoard = () => (
  '<section class="films"></section>'
);

export default class FilmsBoardView {
  #element = null;
  #title = null;
  #isExtra = null;

  constructor(title, isExtra) {
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    this.#element.append(new FilmsView(this.#title, this.#isExtra).element);

    this._filmsCardList = this.#element.querySelector('.films-list__container');

    for (let i = 1; i <= Math.min(cards.length, CARDS_COUNT_PER_STEP); i++) {
      const filmCard = new CardFilmView(cards[i]);

      this._filmsCardList.append(filmCard.element);
      filmCard.element.addEventListener('click', () => renderPopup(cards[i]));
    }

    if (cards.length > CARDS_COUNT_PER_STEP) {
      let renderedCardsCount = CARDS_COUNT_PER_STEP;

      this.#element.append(new ButtonShowMoreView().element);

      const showMoreButton = this.#element.querySelector('.films-list__show-more');

      showMoreButton.addEventListener('click', (evt) => {
        evt.preventDefault();

        cards
          .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
          .forEach((card) => this._filmsCardList.append(new CardFilmView(card).element));

        renderedCardsCount += CARDS_COUNT_PER_STEP;

        if (renderedCardsCount >= cards.length) {
          showMoreButton.remove();
        }
      });
    }

    return this.#element;
  }

  get template() {
    return createFilmsBoard();
  }

  removeElement() {
    this.#element = null;
  }
}
