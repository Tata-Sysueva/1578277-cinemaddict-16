import {createProfileTemplate} from './view/profile-view';
import {createSiteMenuTemplate} from './view/menu-view';
import {createSortTemplate} from  './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createCardFilm} from './view/card-film-view';
import {createFilmsBoard} from './view/films-board-view';
import {createFooterTemplate} from './view/footer-view';
import {createButtonShowMore} from './view/button-show-more';
import {createFilmInfoTemplate} from './view/popup-film-info-view';
import {RenderPosition, renderTemplate} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import {createPopupTemplate} from './view/popup-container-view';
import {createCommentsContainer} from './view/popup-comments-view';
import {generateComment} from './mock/comment';
import {createComment} from './view/comment-view';

const CARD_ALL_FILM_COUNT = 5;
const CARD_FILM_COUNT = 2;
const FILM_STATE_COUNT = 1;
const COMMENT_STATE_COUNT = 4;

const cardsFilms = Array.from({length: CARD_ALL_FILM_COUNT}, generateCardFilm);
const filmsState = Array.from({length: FILM_STATE_COUNT}, generateCountFilms);
const comment = Array.from({length: COMMENT_STATE_COUNT}, generateComment);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP: {title: 'Top rated', isExtra: true},
  MOST_COMMENT: {title: 'Most commented', isExtra: true},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createSiteMenuTemplate(filmsState[0]));
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createFilmsBoard());

const filmsBoardElement = siteMainElement.querySelector('.films');

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra));

const filmsCardContainer = filmsBoardElement.querySelector('.films-list');

renderTemplate(filmsCardContainer, createButtonShowMore());

const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_ALL_FILM_COUNT; i++) {
  renderTemplate(filmsCardList, createCardFilm(cardsFilms[i]));
}

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.TOP.title, FilmsInfo.TOP.isExtra));
renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.MOST_COMMENT.title, FilmsInfo.MOST_COMMENT.isExtra));

const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const filmsExtraContainer of filmsExtraContainers) {
  for (let i = 0; i < CARD_FILM_COUNT; i++) {
    renderTemplate(filmsExtraContainer, createCardFilm(cardsFilms[i]));
  }
}

renderTemplate(siteFooterElement, createFooterTemplate(filmsState[0]));

/*renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTER_END);

const popupFilmInfoTemplate = document.querySelector('.film-details__top-container');

renderTemplate(popupFilmInfoTemplate, createFilmInfoTemplate(cardsFilms[0]));

const popupCommentsTemplate = document.querySelector('.film-details__bottom-container');

renderTemplate(popupCommentsTemplate, createCommentsContainer());

const popupCommentsList = popupCommentsTemplate.querySelector('.film-details__comments-list');

for (let i = 0; i < COMMENT_STATE_COUNT; i++) {
  renderTemplate(popupCommentsList, createComment(comment[i]));
}*/

