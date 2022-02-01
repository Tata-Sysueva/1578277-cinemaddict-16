import FooterView from './view/footer-view';
import { render } from './render';
import FilmsSectionsPresenter from './presenter/films-board-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import ApiService from './api-service.js';
import CommentsModel from './model/comments-model';
import { AUTHORIZATION, END_POINT } from './const';
import ProfilePresenter from './presenter/profile-presenter';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel(apiService);
const commentsModel = new CommentsModel(apiService);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filmsSectionsPresenter = new FilmsSectionsPresenter(siteMainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);

filterPresenter.init();
filmsSectionsPresenter.init();

filmsModel.init().finally(() => {
  profilePresenter.init();
  render(siteFooterElement, new FooterView(filmsModel.films.length));
});
