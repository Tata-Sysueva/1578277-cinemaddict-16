import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import SortView from './view/sort-view';
import FooterView from './view/footer-view';
import {renderElement} from './render.js';
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

const filmsSectionsPresenter = new FilmsSectionsPresenter(siteMainElement);

renderElement(siteHeaderElement, new ProfileView().element);
renderElement(siteMainElement, new MenuView(filters).element);
renderElement(siteMainElement, new SortView().element);

renderElement(siteFooterElement, new FooterView(generateCountFilms()).element);

filmsSectionsPresenter.init(cards);
