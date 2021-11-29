import {createProfileTemplate} from './view/profile-view.js';
import {createSiteMenuTemplate} from './view/menu-view.js';
import {createSortTemplate} from  './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createCardFilm} from './view/card-film-view';
import {createFilmsBoard} from './view/films-board-view';
import {createFooterTemplate} from './view/footer-view';
import {renderTemplate} from './render.js';
import {generateCardFilm} from './mock/film-card.js';

const CARD_ALL_FILM_COUNT = 5;
const CARD_FILM_COUNT = 2;

const cardsFilms = Array.from({length: CARD_ALL_FILM_COUNT}, generateCardFilm);

const FilmInfoTitle = {
  AllFilmTitle: 'All movies. Upcoming',
  TopTitle: 'Top rated',
  MostCommentTitle: 'Most commented',
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');


renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createSiteMenuTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createFilmsBoard());

const filmsBoardElement = siteMainElement.querySelector('.films');

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmInfoTitle.AllFilmTitle, false, true));

const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_ALL_FILM_COUNT; i++) {
  renderTemplate(filmsCardList, createCardFilm(cardsFilms[i]));
}

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmInfoTitle.TopTitle));
renderTemplate(filmsBoardElement, createFilmsTemplate(FilmInfoTitle.MostCommentTitle));

const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const filmsExtraContainer of filmsExtraContainers) {
  for (let i = 0; i < CARD_FILM_COUNT; i++) {
    renderTemplate(filmsExtraContainer, createCardFilm(cardsFilms[i]));
  }
}

renderTemplate(siteFooterElement, createFooterTemplate());
