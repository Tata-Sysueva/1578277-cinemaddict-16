import FilmsBoardView from '../view/films-board-view';
import FilmsView from '../view/films-view';
import ButtonShowMoreView from '../view/button-show-more';
import {remove, render, RenderPosition} from '../render.js';
import {SortType, SortFilmsRelease, SortFilmsRating} from '../utils';
import CardFilmPresenter from './card-film-presenter';
import FilmsContainerView from '../view/films-container-view';
import SortView from '../view/sort-view';
import {FilmsInfo, UpdateType} from '../const';
import {filter} from '../filters';
import StatisticsView from '../view/statistics-view';
import LoadingView from '../view/loading-view';

const CARDS_COUNT_PER_STEP = 5;

const from = 0;
const to = 2;

export default class FilmsSectionsPresenter {
  #boardContainer = null;
  #filmsList = null;
  #filmsContainer = null;
  #filmsModel = null;
  #sortComponent = null;
  #showMoreButton = null;
  #filterModel = null;
  #statisticsComponent = null;

  #filmsBoardElement = new FilmsBoardView();
  #loadingComponent = new LoadingView();

  #renderedCardsCount = CARDS_COUNT_PER_STEP;
  #cardFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #statisticsMode = false;
  #isLoading = true;

  constructor(boardContainer, filmsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#renderLoading(FilmsInfo.LOADING.title, FilmsInfo.LOADING.isExtra);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(SortFilmsRelease);
      case SortType.BY_RATING:
        return filteredFilms.sort(SortFilmsRating);
      default:
        return filteredFilms;
    }
  }

  init = () => {
    render(this.#boardContainer, this.#filmsBoardElement);

    this.#renderFilmsSections(from, to);
  }

  #handleViewAction = (updateType, update) => {
    this.#filmsModel.updateFilm(updateType, update);
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType);
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardFilmPresenter.get(data.id).init(data);

        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderCardList();

        break;
      case UpdateType.MAJOR:
        if (this.#statisticsMode) {
          this.#statisticsMode = false;
          remove(this.#statisticsComponent);
          this.init();
        }

        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsSections(from, to);

        break;
      case UpdateType.DESTROY:
        this.#statisticsMode = true;

        this.#clearFilmsContainer();

        this.#statisticsComponent = new StatisticsView(this.films);
        render(this.#boardContainer, this.#statisticsComponent);

        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsSections(from, to);
        break;
      default:
        throw new Error(`Unknown update type: ${updateType}`);
    }
  }

  #onShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmsCount, this.#renderedCardsCount + CARDS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedCardsCount, newRenderedFilmCount);

    this.#renderCards(films);

    this.#renderedCardsCount = newRenderedFilmCount;

    if (this.#renderedCardsCount >= filmsCount) {
      this.#showMoreButton.element.remove();
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButton = new ButtonShowMoreView();
    this.#showMoreButton.setOnShowMoreButtonClick(this.#onShowMoreButtonClick);
    render(this.#filmsList, this.#showMoreButton.element);
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    remove(this.#filmsList);
    this.#filmsContainer.innerHTML = ' ';

    remove(this.#sortComponent);
    this.#showMoreButton.element.remove();

    if (resetRenderedFilmCount) {
      this.#renderedCardsCount = CARDS_COUNT_PER_STEP;
    } else {
      this.#renderedCardsCount = Math.min(filmsCount, this.#renderedCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #clearFilmsContainer = () => {
    remove(this.#filmsBoardElement);
    remove(this.#sortComponent);
    this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderFilmsSections(from, to);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmsBoardElement, this.#sortComponent, RenderPosition.BEFORE_BEGIN);
  }

  #renderCard = (film) => {
    const cardFilmPresenter = new CardFilmPresenter(this.#filmsContainer, this.#handleViewAction, this.#filterModel.filter);
    cardFilmPresenter.init(film);
    this.#cardFilmPresenter.set(film.id, cardFilmPresenter);
  }

  #renderCards = (films) => {
    films.forEach((film) => this.#renderCard(film));
  }

  #renderCardList = () => {
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, this.#renderedCardsCount));

    this.#renderSort();
    this.#renderCards(films);

    if (filmsCount > this.#renderedCardsCount) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsSection = (title, isExtra, films) => {
    this.#filmsList = new FilmsView(title, isExtra);
    this.#filmsContainer = new FilmsContainerView();
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

  #renderLoading = () => {
    render(this.#filmsBoardElement, this.#loadingComponent);
  }

  #renderFilmsSections = (from, to) => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.films.length > from ) {
      this.#renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, this.films);
      // this.#renderFilmsSection(
      //   FilmsInfo.TOP_RATED.title,
      //   FilmsInfo.TOP_RATED.isExtra,
      //   getSortedFilms(this.films, SortType.BY_RATING).slice(from, to)); // NB! убрала slice из getSortedFilms
      // this.#renderFilmsSection(
      //   FilmsInfo.MOST_COMMENTED.title,
      //   FilmsInfo.MOST_COMMENTED.isExtra,
      //   getSortedFilms(this.films, SortType.BY_COMMENTED).slice(from, to));
    } else {
      //this.#renderEmptySection(FilmsInfo.EMPTY_ALL.title, FilmsInfo.EMPTY_ALL.isExtra);
    }
  };
}
