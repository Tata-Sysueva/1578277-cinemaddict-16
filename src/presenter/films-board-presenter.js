import FilmsBoardView from '../view/films-board-view';
import FilmsView from '../view/films-view';
import ButtonShowMoreView from '../view/button-show-more';
import { remove, render, RenderPosition } from '../render.js';
import { SortFilmsRelease, SortFilmsRating } from '../utils';
import CardFilmPresenter from './card-film-presenter';
import FilmsContainerView from '../view/films-container-view';
import SortView from '../view/sort-view';
import { filter } from '../filters';
import StatisticsView from '../view/statistics-view';
import LoadingView from '../view/loading-view';
import {
  FilmsInfo,
  FilterType,
  UpdateType,
  UserAction,
  SortType
} from '../const';

const CARDS_COUNT_PER_STEP = 5;

export default class FilmsSectionsPresenter {
  #boardContainer = null;
  #filmsList = null;
  #filmsContainer = null;
  #filmsModel = null;
  #sortComponent = null;
  #showMoreButton = null;
  #filterModel = null;
  #statisticsComponent = null;
  #commentsModel = null;

  #filmsBoardElement = new FilmsBoardView();
  #loadingComponent = new LoadingView();

  #renderedCardsCount = CARDS_COUNT_PER_STEP;
  #cardFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #statisticsMode = false;
  #isLoading = true;
  #isEmpty = false;

  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#renderLoading(FilmsInfo.LOADING.title, FilmsInfo.LOADING.isExtra);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
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

    this.#renderFilmsSections();
  }

  #handleViewAction = (updateType, update) => {
    this.#filmsModel.updateFilm(updateType, update);
  }

  #handleViewPopupAction = (actionType, updateType, update, position) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update, position);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update, position);
        break;
    }
  }

  #handleModelEvent = (updateType, data, position) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardFilmPresenter.get(data.id).init(data, position);

        break;
      case UpdateType.MINOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: false});
        this.#renderFilmsSections();

        break;
      case UpdateType.MAJOR:
        if (this.#statisticsMode) {
          this.#statisticsMode = false;
          remove(this.#statisticsComponent);
          this.init();
        }

        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsSections();

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
        this.#renderFilmsSections();
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
    this.#cardFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#cardFilmPresenter.clear();

    const filmsCount = this.films.length;

    remove(this.#filmsList);
    remove(this.#filmsContainer);

    remove(this.#sortComponent);
    this.#showMoreButton.element.remove();

    if (this.#isEmpty) {
      remove(this.#filmsList);
    }

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
    this.#renderFilmsSections();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#filmsBoardElement, this.#sortComponent, RenderPosition.BEFORE_BEGIN);
  }

  #renderCard = (film) => {
    const cardFilmPresenter = new CardFilmPresenter(
      this.#filmsContainer,
      this.#handleViewAction,
      this.#filterModel.filter,
      this.#handleViewPopupAction,
      this.#commentsModel,
    );

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

    if (this.#isEmpty) {
      return;
    }

    render(this.#filmsList, this.#filmsContainer);

    if (isExtra) {
      this.#renderCards(films);
    } else {
      this.#renderCardList();
    }
  }

  #renderLoading = () => {
    render(this.#filmsBoardElement, this.#loadingComponent);
  }

  #renderFilmsSections = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.films.length) {
      this.#isEmpty = false;

      this.#renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, this.films);
    } else {
      this.#isEmpty = true;

      switch (this.#filterModel.filter) {
        case FilterType.WATCHLIST:
          this.#renderFilmsSection(FilmsInfo.EMPTY_WATCHLIST.title, FilmsInfo.EMPTY_WATCHLIST.isExtra);
          break;
        case FilterType.HISTORY:
          this.#renderFilmsSection(FilmsInfo.EMPTY_HISTORY.title, FilmsInfo.EMPTY_HISTORY.isExtra);
          break;
        case FilterType.FAVORITES:
          this.#renderFilmsSection(FilmsInfo.EMPTY_FAVORITES.title, FilmsInfo.EMPTY_FAVORITES.isExtra);
          break;
        default:
          this.#renderFilmsSection(FilmsInfo.EMPTY_ALL.title, FilmsInfo.EMPTY_ALL.isExtra);
          break;
      }
    }
  };
}
