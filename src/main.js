import {createProfileTemplate} from './view/profile-view.js';
import {createSiteMenuTemplate} from './view/menu-view.js';
import {createSortTemplate} from  './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createCardFilm} from './view/card-film-view';
import {createFilmsBoard} from './view/films-board-view';
import {createFooterTemplate} from './view/footer-view';
import {renderTemplate, RenderPosition} from './render.js';

const CARD_ALL_FILM_COUNT = 5;
const CARD_FILM_COUNT = 2;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFORE_END);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFORE_END);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFORE_END);
renderTemplate(siteMainElement, createFilmsBoard(), RenderPosition.BEFORE_END);

const filmsBoardElement = siteMainElement.querySelector('.films');

const filmInfo = {
  allFilmTitle: 'All movies. Upcoming',
  topTitle: 'Top rated',
  mostCommentTitle: 'Most commented',
  isExtra: false,
  isShowMoreVisible: true,
};

renderTemplate(filmsBoardElement, createFilmsTemplate(filmInfo.allFilmTitle, filmInfo.isExtra, filmInfo.isShowMoreVisible), RenderPosition.BEFORE_END);

const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_ALL_FILM_COUNT; i++) {
  renderTemplate(filmsCardList, createCardFilm(), RenderPosition.BEFORE_END);
}

renderTemplate(filmsBoardElement, createFilmsTemplate(filmInfo.topTitle), RenderPosition.BEFORE_END);
renderTemplate(filmsBoardElement, createFilmsTemplate(filmInfo.mostCommentTitle), RenderPosition.BEFORE_END);

const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const filmsExtraContainer of filmsExtraContainers) {
  for (let i = 0; i < CARD_FILM_COUNT; i++) {
    renderTemplate(filmsExtraContainer, createCardFilm(), RenderPosition.BEFORE_END);
  }
}

renderTemplate(siteFooterElement, createFooterTemplate(), RenderPosition.BEFORE_END);
