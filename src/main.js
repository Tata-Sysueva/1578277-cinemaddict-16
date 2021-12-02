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
import {createNewComment} from './view/new-comment-view';

const CARD_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;
const CARDS_FILM_COUNT = 2;
const FILM_STATE_COUNT = 1;
const COMMENT_STATE_COUNT = 4;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const filmsState = Array.from({length: FILM_STATE_COUNT}, generateCountFilms);
const comments = Array.from({length: COMMENT_STATE_COUNT}, generateComment);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP: {title: 'Top rated', isExtra: true},
  MOST_COMMENT: {title: 'Most commented', isExtra: true},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const watchFilms = cards.filter((card) => !!card.watchlist);
const alreadyWatchedFilms = cards.filter((card) => !!card.already_watched);
const favoriteFilms = cards.filter((card) => !!card.favorite);

export const generateFilterFilms = () => ({
  countWatchlistFilms: watchFilms.length,
  countHistoryFilms: alreadyWatchedFilms.length,
  countFavoritesFilms: favoriteFilms.length,
});

const filterFilms = Array.from({length: FILM_STATE_COUNT}, generateFilterFilms);


renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createSiteMenuTemplate(filterFilms[0]));
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createFilmsBoard());

const filmsBoardElement = siteMainElement.querySelector('.films');

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra));

const filmsCardContainer = filmsBoardElement.querySelector('.films-list');
const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

for (let i = 1; i <= Math.min(cards.length, CARDS_COUNT_PER_STEP); i++) {
  renderTemplate(filmsCardList, createCardFilm(cards[i]));
}

if (cards.length > CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  renderTemplate(filmsCardContainer, createButtonShowMore());

  const showMoreButton = filmsCardContainer.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    cards
      .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
      .forEach((card) => renderTemplate(filmsCardList, createCardFilm(card)))

    renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.TOP.title, FilmsInfo.TOP.isExtra));
renderTemplate(filmsBoardElement, createFilmsTemplate(FilmsInfo.MOST_COMMENT.title, FilmsInfo.MOST_COMMENT.isExtra));

const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const filmsExtraContainer of filmsExtraContainers) {
  for (let i = 0; i < CARDS_FILM_COUNT; i++) {
    renderTemplate(filmsExtraContainer, createCardFilm(cards[i]));
  }
}

renderTemplate(siteFooterElement, createFooterTemplate(filmsState[0]));

renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTER_END);

const popupFilmInfoTemplate = document.querySelector('.film-details__top-container');
const popupCommentsTemplate = document.querySelector('.film-details__bottom-container');

renderTemplate(popupFilmInfoTemplate, createFilmInfoTemplate(cards[0]));

  renderTemplate(popupCommentsTemplate, createCommentsContainer());

const popupCommentsList = popupCommentsTemplate.querySelector('.film-details__comments-list');
const popupNewCommentContainer = popupCommentsTemplate.querySelector('.film-details__comments-wrap');

comments.forEach((comment) => renderTemplate(popupCommentsList, createComment(comment)));

renderTemplate(popupNewCommentContainer, createNewComment());
