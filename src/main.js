import {createProfileTemplate} from './view/profile-view.js';
import {createSiteMenuTemplate} from './view/menu-view.js';
import {createSortTemplate} from  './view/sort-view';
import {createFilmsTemplate} from './view/films-view';
import {createCardFilm} from './view/card-film-view';
import {createPopupTemplate} from './view/popup-container-view';
import {createFilmInfoTemplate} from './view/popup-film-info-view';
import {createFilmInfoElement} from './view/film-info-view';
import {createCommentsContainer} from './view/popup-comments-view';
import {createCommentElement} from './view/comment-view';
import {createNewCommentElement} from './view/new-comment-view';
import {renderTemplate, RenderPosition} from './render.js';

const CARD_FILM_COUNT = 5;
const COMMENT_COUNT = 4;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const filmsContainer = siteMainElement.querySelector('.films');
const filmsCardList = filmsContainer.querySelector('.films-list__container');

for (let i = 0; i < CARD_FILM_COUNT; i++) {
  renderTemplate(filmsCardList, createCardFilm(), RenderPosition.BEFOREEND);
}

renderTemplate(siteMainElement, createPopupTemplate(), RenderPosition.BEFOREEND);

const popupFormElement = siteMainElement.querySelector('.film-details .film-details__inner');
const popupFilmInfoContainer = popupFormElement.querySelector('.film-details__top-container');

renderTemplate(popupFilmInfoContainer, createFilmInfoTemplate(), RenderPosition.BEFOREEND);

const closePopupElement = popupFilmInfoContainer.querySelector('.film-details__close');

renderTemplate(closePopupElement, createFilmInfoElement(), RenderPosition.AFTEREND);

const popupCommentsContainer = popupFormElement.querySelector('.film-details__bottom-container');

renderTemplate(popupCommentsContainer, createCommentsContainer(), RenderPosition.BEFOREEND);

const commentList = popupCommentsContainer.querySelector('.film-details__comments-list');

for (let i = 0; i < COMMENT_COUNT; i++) {
  renderTemplate(commentList, createCommentElement(), RenderPosition.BEFOREEND);
}

const newCommentContainer = popupCommentsContainer.querySelector('.film-details__new-comment');

renderTemplate(newCommentContainer, createNewCommentElement(), RenderPosition.BEFOREEND);
