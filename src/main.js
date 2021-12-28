import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import FooterView from './view/footer-view';
import {render} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import {generateFilters} from './filters';
import FilmsSectionsPresenter from './presenter/films-board-presenter';

const CARD_COUNT = 25;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const filters = generateFilters(cards);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView());
render(siteMainElement, new MenuView(filters));

const filmsSectionsPresenter = new FilmsSectionsPresenter(siteMainElement);

render(siteFooterElement, new FooterView(generateCountFilms()));

filmsSectionsPresenter.init(cards);
