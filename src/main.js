import ProfileView from './view/profile-view';
import FooterView from './view/footer-view';
import {render} from './render';
import {generateCardFilm} from './mock/film-card';
import {generateCountFilms} from './mock/films-state';
import FilmsSectionsPresenter from './presenter/films-board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const CARD_COUNT = 25;

const films = Array.from({length: CARD_COUNT}, generateCardFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView());

const filmsSectionsPresenter = new FilmsSectionsPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();

render(siteFooterElement, new FooterView(generateCountFilms()));

filmsSectionsPresenter.init();
