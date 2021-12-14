import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import SortView from './view/sort-view';
import FilmsBoardView from './view/films-board-view';
import FooterView from './view/footer-view';
import {renderElement} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import PopupContainerView from './view/popup-container-view';
import {generateFilters} from './filters';
import FilmsView from './view/films-view';
import {isEscapeKey} from './util';
import CardFilmView from './view/card-film-view';
import ButtonShowMoreView from './view/button-show-more';

const CARD_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const filters = generateFilters(cards);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP: {title: 'Top rated', isExtra: true},
  MOST_COMMENT: {title: 'Most commented', isExtra: true},
  EMPTY_ALL: {title: 'There are no movies in our database', isExtra: false},
  EMPTY_WATCHLIST: {title: 'There are no movies to watch now', isExtra: false},
  EMPTY_HISTORY: {title: 'There are no watched movies now', isExtra: false},
  EMPTY_FAVORITES: {title: 'There are no favorite movies now', isExtra: false},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

renderElement(siteHeaderElement, new ProfileView().element);
renderElement(siteMainElement, new MenuView(filters).element);
renderElement(siteMainElement, new SortView().element);
renderElement(siteMainElement, new FilmsBoardView().element);
renderElement(siteFooterElement, new FooterView(generateCountFilms()).element);

const getTopFilms = () => {
  const topCards = cards.slice();

  topCards
    .sort((curCard, aftCard) => aftCard.rating - curCard.rating);

  return topCards.slice(0, 2);
};

const getMostCommendedFilms = () => {
  const mostCommendedFilms = cards.slice();

  mostCommendedFilms
    .sort((curCard, aftCard) => aftCard.comments - curCard.comments);

  return mostCommendedFilms.slice(0, 2);
};

const renderPopup = (film) => {
  const popup = new PopupContainerView(film);
  const body = document.querySelector('body');

  body.appendChild(popup.element);
  body.classList.add('hide-overflow');

  const closePopup = () => {
    popup.element.remove();
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onPopupEscKeydown);
  };

  function onPopupEscKeydown(evt) {
    if (isEscapeKey(evt)) {
      closePopup();
    }
  }

  const closePopupButton = body.querySelector('.film-details__close-btn');
  closePopupButton.addEventListener('click', closePopup);
  document.addEventListener('keydown', onPopupEscKeydown);
};

const renderFilmsSection = (title, isExtra, films) => {
  const filmsBoardElement = siteMainElement.querySelector('.films');

  renderElement(filmsBoardElement, new FilmsView(title, isExtra).element);

  const getRenderCards = (data, container) => {
    const filmCard = new CardFilmView(data);
    renderElement(container, filmCard.element);
    filmCard.setOnPopupClick(() => renderPopup(data));
  };

  if (isExtra) {
    const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

    if (title === 'Top rated') {
      films.forEach((film) => getRenderCards(film, filmsExtraContainers[0]));
    } else {
      films.forEach((film) => getRenderCards(film, filmsExtraContainers[1]));
    }
  } else if (films.length > 0) {
    const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

    films
      .slice(0, Math.min(films.length, CARDS_COUNT_PER_STEP))
      .forEach((film) => getRenderCards(film, filmsCardList));

    if (films.length > CARDS_COUNT_PER_STEP) {
      const showMoreButton = new ButtonShowMoreView();
      let renderedCardsCount = CARDS_COUNT_PER_STEP;

      renderElement(filmsBoardElement, showMoreButton.element);

      showMoreButton.setOnShowMoreButtonClick(() => {
        films
          .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
          .forEach((film) => getRenderCards(film, filmsCardList));

        renderedCardsCount += CARDS_COUNT_PER_STEP;

        if (renderedCardsCount >= films.length) {
          showMoreButton.remove();
        }
      });
    }
  }
};

const renderEmptySection = (title, isExtra = false) => {
  const filmsBoardElement = siteMainElement.querySelector('.films');

  renderElement(filmsBoardElement, new FilmsView(title, isExtra).element);
  const filmsBoardTitle = filmsBoardElement.querySelector('.films-list__title');
  filmsBoardTitle.classList.remove('visually-hidden');
};

const renderFilmsSections = (films) => {
  if (films.length > 0 ) {
    renderFilmsSection(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra, cards);
    renderFilmsSection(FilmsInfo.TOP.title, FilmsInfo.TOP.isExtra, getTopFilms());
    renderFilmsSection(FilmsInfo.MOST_COMMENT.title, FilmsInfo.MOST_COMMENT.isExtra, getMostCommendedFilms());
  } else {
    renderEmptySection(FilmsInfo.EMPTY_ALL.title);
  }
};

renderFilmsSections(cards);
