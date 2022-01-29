import ProfileView from './view/profile-view';
import FooterView from './view/footer-view';
import {render} from './render';
import FilmsSectionsPresenter from './presenter/films-board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic c4320a4476d34d4bba63f4c6c2d65bdc';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView());

const filmsSectionsPresenter = new FilmsSectionsPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
filmsSectionsPresenter.init();
filmsModel.init().finally(() => {
  render(siteFooterElement, new FooterView(filmsModel.films.length));
});
