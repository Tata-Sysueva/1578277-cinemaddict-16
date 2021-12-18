import FilmsBoardView from '../view/films-board-view';
import FilmsView from '../view/films-view';
import ButtonShowMoreView from '../view/button-show-more';
import {renderElement} from '../render.js';
import {FilmsSortType, getSortedFilms} from '../utils';
import CardFilmPresenter from './card-film-presenter';

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

export  default class FilmsSectionsPresenter {
  #boardContainer = null;
  #filmsList = null;
  #filmsContainer = null;
  #cardFilmPresenter = null;

  #filmsBoardElement = new FilmsBoardView().element;
  #showMoreButton = new ButtonShowMoreView();

  #filmsInfo = [];
  #renderedCardsCount = CARDS_COUNT_PER_STEP;


  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (filmsInfo) => {
    this.#filmsInfo = [...filmsInfo];

    renderElement(this.#boardContainer, this.#filmsBoardElement);

    this.#renderFilmsSections();
  }

  #onShowMoreButtonClick = () => {
    this.#cardFilmPresenter.init(
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
    renderElement(this.#filmsList, this.#showMoreButton.element);
    this.#showMoreButton.setOnShowMoreButtonClick(this.#onShowMoreButtonClick);
  }

  #renderFilmsSection = (title, isExtra, films) => {
    this.#filmsList = new FilmsView(title, isExtra).element;
    renderElement(this.#filmsBoardElement, this.#filmsList);

    this.#cardFilmPresenter = new CardFilmPresenter(this.#filmsList);


    if (isExtra) {
      this.#cardFilmPresenter.init(films);
    } else {
      this.#cardFilmPresenter.init(
        films.slice(0, Math.min(films.length, CARDS_COUNT_PER_STEP))
      );

      if (films.length > CARDS_COUNT_PER_STEP) {
        this.#renderShowMoreButton();
      }
    }
  }

  #renderEmptySection = () => {
    renderElement(this.#filmsBoardElement, new FilmsView(this.#filmsInfo, this.#filmsContainer));
  }

  #renderFilmsSections = () => {
    if (this.#filmsInfo.length > 0 ) {
      this.#renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, this.#filmsInfo);
      this.#renderFilmsSection(
        FilmsInfo.TOP_RATED.title,
        FilmsInfo.TOP_RATED.isExtra,
        getSortedFilms(this.#filmsInfo, FilmsSortType.TOP_RATED).slice(0, 2));
      this.#renderFilmsSection(
        FilmsInfo.MOST_COMMENTED.title,
        FilmsInfo.MOST_COMMENTED.isExtra,
        getSortedFilms(this.#filmsInfo, FilmsSortType.MOST_COMMENTED).slice(0, 2));
    } else {
      this.#renderEmptySection(FilmsInfo.EMPTY_ALL.title, FilmsInfo.EMPTY_ALL.isExtra);
    }
  }
}
