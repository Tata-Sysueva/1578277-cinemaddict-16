import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import SortView from './view/sort-view';
import FilmsBoardView from './view/films-board-view';
import FooterView from './view/footer-view';
import FilmsContainerView from './view/films-container-view';
import {removeElement, renderElement} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import PopupContainerView from './view/popup-container-view';
import {generateFilters} from './filters';
import FilmsView from './view/films-view';
import {FilmsSortType, getSortedFilms, isEscapeKey} from './utils';
import CardFilmView from './view/card-film-view';
import ButtonShowMoreView from './view/button-show-more';

const CARD_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const filters = generateFilters(cards);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP_RATED: {title: 'Top rated', isExtra: true},
  MOST_COMMENTED: {title: 'Most commented', isExtra: true},
  EMPTY_ALL: {title: 'There are no movies in our database', isExtra: true},
  EMPTY_WATCHLIST: {title: 'There are no movies to watch now', isExtra: false},
  EMPTY_HISTORY: {title: 'There are no watched movies now', isExtra: false},
  EMPTY_FAVORITES: {title: 'There are no favorite movies now', isExtra: false},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const filmsBoardElement = new FilmsBoardView().element;

renderElement(siteHeaderElement, new ProfileView().element);
renderElement(siteMainElement, new MenuView(filters).element);
renderElement(siteMainElement, new SortView().element);
renderElement(siteMainElement, filmsBoardElement);
renderElement(siteFooterElement, new FooterView(generateCountFilms()).element);

const renderPopup = (film) => {
  const popup = new PopupContainerView(film);

  renderElement(document.body, popup.element);
  document.body.classList.add('hide-overflow');

  const closePopup = () => {
    removeElement(popup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onPopupEscKeydown);
  };

  function onPopupEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      closePopup();
    }
  }

  popup.setOnCloseButtonClick(() => closePopup());
  document.addEventListener('keydown', onPopupEscKeydown);
};

const renderCards = (films, container) => {
  films.forEach((film) => {
    const filmCard = new CardFilmView(film);
    renderElement(container, filmCard.element);
    filmCard.setOnPopupClick(() => renderPopup(film));
  });
};

const renderFilmsSection = (title, isExtra, films) => {
  const filmsList = new FilmsView(title, isExtra).element;
  const filmsContainer = new FilmsContainerView().element;
  renderElement(filmsBoardElement, filmsList);
  renderElement(filmsList, filmsContainer);

  if (isExtra) {
    renderCards(films, filmsContainer);
  } else {
    renderCards(films.slice(0, Math.min(films.length, CARDS_COUNT_PER_STEP)), filmsContainer);

    if (films.length > CARDS_COUNT_PER_STEP) {
      const showMoreButton = new ButtonShowMoreView();
      let renderedCardsCount = CARDS_COUNT_PER_STEP;

      renderElement(filmsList, showMoreButton.element);

      showMoreButton.setOnShowMoreButtonClick(() => {
        renderCards(films.slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP), filmsContainer);

        renderedCardsCount += CARDS_COUNT_PER_STEP;

        if (renderedCardsCount >= films.length) {
          showMoreButton.remove();
        }
      });
    }
  }
};

const renderEmptySection = (title, isExtra) => {
  renderElement(filmsBoardElement, new FilmsView(title, isExtra).element);
};

const renderFilmsSections = (films) => {
  if (films.length > 0 ) {
    renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, cards);
    renderFilmsSection(
      FilmsInfo.TOP.title,
      FilmsInfo.TOP.isExtra,
      getSortedFilms(films, FilmsSortType.TOP_RATED).slice(0, 2));
    renderFilmsSection(
      FilmsInfo.MOST_COMMENT.title,
      FilmsInfo.MOST_COMMENT.isExtra,
      getSortedFilms(films, FilmsSortType.MOST_COMMENTED).slice(0, 2));
  } else {
    renderEmptySection(FilmsInfo.EMPTY_ALL.title, FilmsInfo.EMPTY_ALL.isExtra);
  }
};

renderFilmsSections(cards);
