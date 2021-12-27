import FilmsBoardView from '../view/films-board-view';
import FilmsView from '../view/films-view';
import ButtonShowMoreView from '../view/button-show-more';
import {render, RenderPosition} from '../render.js';
import {FilmsSortType, getSortedFilms, updateItem} from '../utils';
import CardFilmPresenter from './card-film-presenter';
import FilmsContainerView from '../view/films-container-view';
import SortView, {SortType} from '../view/sort-view';

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

  #filmsBoardElement = new FilmsBoardView();
  #sortComponent = new SortView();
  #showMoreButton = new ButtonShowMoreView();

  #filmsInfo = [];
  #renderedCardsCount = CARDS_COUNT_PER_STEP;
  #cardFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmsInfo = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (filmsInfo) => {
    this.#filmsInfo = [...filmsInfo];
    this.#sourcedFilmsInfo = [...filmsInfo];

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

  #handleFilmChange = (updatedCard) => {
    this.#filmsInfo = updateItem(this.#filmsInfo, updatedCard);
    this.#sourcedFilmsInfo = updateItem(this.#sourcedFilmsInfo, updatedCard);
    this.#cardFilmPresenter.get(updatedCard.id).init(updatedCard);
  }

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#filmsInfo.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
        break;
      case SortType.BY_RATING:
        this.#filmsInfo.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      default:
        this.#filmsInfo = [...this.#sourcedFilmsInfo];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);

    this.#clearCards();
    this.#renderCardList();
  }

  #clearCards = () => {
    while (this.#filmsContainer.firstChild) {
      this.#filmsContainer.removeChild(this.#filmsContainer.firstChild);
    }

    this.#renderedCardsCount = CARDS_COUNT_PER_STEP;
    this.#showMoreButton.element.remove();
  }

  #renderSort = () => {
    render(this.#filmsBoardElement, this.#sortComponent, RenderPosition.BEFORE_BEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderCard = (film) => {
    const cardFilmPresenter = new CardFilmPresenter(this.#filmsContainer, this.#handleFilmChange);
    cardFilmPresenter.init(film);
    this.#cardFilmPresenter.set(film.id, cardFilmPresenter);
  }

  #renderCards = (films) => {
    films.forEach((film) => this.#renderCard(film));
  }

  #renderCardList = () => {
    this.#renderCards(
      this.#filmsInfo.slice(0, Math.min(this.#filmsInfo.length, CARDS_COUNT_PER_STEP))
    );

    if (this.#filmsInfo.length > CARDS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsSection = (title, isExtra, films) => {
    this.#filmsList = new FilmsView(title, isExtra).element;
    this.#filmsContainer = new FilmsContainerView().element;
    render(this.#filmsBoardElement, this.#filmsList);
    render(this.#filmsList, this.#filmsContainer);

    if (isExtra) {
      this.#renderCards(films);
    } else {
      this.#renderCardList();
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

    this.#renderSort();
  }
}
