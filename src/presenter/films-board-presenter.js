import FilmsBoardView from '../view/films-board-view';
import FilmsView from '../view/films-view';
import ButtonShowMoreView from '../view/button-show-more';
import {render} from '../render.js';
import {FilmsSortType, getSortedFilms, updateItem} from '../utils';
import CardFilmPresenter from './card-film-presenter';
import FilmsContainerView from '../view/films-container-view';

const CARDS_COUNT_PER_STEP = 5;

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP_RATED: {title: 'Top rated', isExtra: true},
  MOST_COMMENTED: {title: 'Most commented', isExtra: true},
  EMPTY_ALL: {title: 'There are no movies in our database', isExtra: true},
  EMPTY_WATCHLIST: {title: 'There are no movies to watch now', isExtra: false},
  EMPTY_HISTORY: {title: 'There are no watched movies now', isExtra: false},
  EMPTY_FAVORITES: {title: 'There are no favorite movies now', isExtra: false},
};

const from = 0;
const to = 2;

export default class FilmsSectionsPresenter {
  #boardContainer = null;
  #filmsList = null;
  #filmsContainer = null;

  #filmsBoardElement = new FilmsBoardView().element;
  #showMoreButton = new ButtonShowMoreView();

  #filmsInfo = [];
  #renderedCardsCount = CARDS_COUNT_PER_STEP;
  #cardFilmPresenter = new Map();


  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (filmsInfo) => {
    this.#filmsInfo = [...filmsInfo];

    render(this.#boardContainer, this.#filmsBoardElement);

    this.#renderFilmsSections(from, to);
  }

  #onShowMoreButtonClick = () => {
    this.#renderCards(
      this.#filmsInfo.slice(
        this.#renderedCardsCount,
        this.#renderedCardsCount + CARDS_COUNT_PER_STEP
      )
    );

    this.#renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (this.#renderedCardsCount >= this.#filmsInfo.length) {
      this.#showMoreButton.element.remove();
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsList, this.#showMoreButton.element);
    this.#showMoreButton.setOnShowMoreButtonClick(this.#onShowMoreButtonClick);
  }

  #renderCard = (film) => {
    const cardFilmPresenter = new CardFilmPresenter(this.#filmsContainer, this.#handleFilmChange);
    cardFilmPresenter.init(film);
    this.#cardFilmPresenter.set(film.id, cardFilmPresenter);

  }

  #renderCards = (films) => {
    films.forEach((film) => this.#renderCard(film));
  }

  #handleFilmChange = (updatedCard) => {
    this.#filmsInfo = updateItem(this.#filmsInfo, updatedCard);
    this.#cardFilmPresenter.get(updatedCard.id).init(updatedCard);
  }

  #renderFilmsSection = (title, isExtra, films) => {
    this.#filmsList = new FilmsView(title, isExtra).element;
    this.#filmsContainer = new FilmsContainerView().element;
    render(this.#filmsBoardElement, this.#filmsList);
    render(this.#filmsList, this.#filmsContainer);

    if (isExtra) {
      this.#renderCards(films);
    } else {
      this.#renderCards(
        films.slice(0, Math.min(films.length, CARDS_COUNT_PER_STEP))
      );

      if (films.length > CARDS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }
  }

  #renderEmptySection = (title, isExtra) => {
    render(this.#filmsBoardElement, new FilmsView(title, isExtra));
  }

  #renderFilmsSections = (from, to) => {
    if (this.#filmsInfo.length > from ) {
      this.#renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, this.#filmsInfo);
      // this.#renderFilmsSection(
      //   FilmsInfo.TOP_RATED.title,
      //   FilmsInfo.TOP_RATED.isExtra,
      //   getSortedFilms(this.#filmsInfo, FilmsSortType.TOP_RATED).slice(from, to));
      // this.#renderFilmsSection(
      //   FilmsInfo.MOST_COMMENTED.title,
      //   FilmsInfo.MOST_COMMENTED.isExtra,
      //   getSortedFilms(this.#filmsInfo, FilmsSortType.MOST_COMMENTED).slice(from, to));
    } else {
      this.#renderEmptySection(FilmsInfo.EMPTY_ALL.title, FilmsInfo.EMPTY_ALL.isExtra);
    }
  }
}
