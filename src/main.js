import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import SortView from  './view/sort-view';
import FilmsBoardView from './view/films-board-view';
import FooterView from './view/footer-view';
import {renderElement} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import PopupContainerView from './view/popup-container-view';
import {generateFilters} from './filters';
import FilmsView from './view/films-view';

const CARD_COUNT = 25;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const filters = generateFilters(cards);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP: {title: 'Top rated', isExtra: true},
  MOST_COMMENT: {title: 'Most commented', isExtra: true},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

renderElement(siteHeaderElement, new ProfileView().element);
renderElement(siteMainElement, new MenuView(filters).element);
renderElement(siteMainElement, new SortView().element);
renderElement(siteMainElement, new FilmsBoardView(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra).element);
renderElement(siteFooterElement, new FooterView(generateCountFilms()).element);

const isEscapeKey = (evt) => evt.key === 'Escape';

export const renderPopup = (film) => {
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

const filmsBoardElement = siteMainElement.querySelector('.films');

renderElement(filmsBoardElement, new FilmsView(FilmsInfo.TOP.title, FilmsInfo.TOP.isExtra).element);
renderElement(filmsBoardElement, new FilmsView(FilmsInfo.MOST_COMMENT.title, FilmsInfo.MOST_COMMENT.isExtra).element);

//взять массив кардс,
// достать оттуда значения rating,
// отсортировать значения от большего к меньшему,
// срезать первые два элемента,
// на основании этих данных отрисовать карточки
//повторить то же с комментариями

// const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');
//
// for (const filmsExtraContainer of filmsExtraContainers) {
//   for (let i = 0; i < CARDS_FILM_COUNT; i++) {
//     renderElement(filmsExtraContainer, new CardFilmView(cards[i]).element);
//   }
// }
