import ProfileView from './view/profile-view';
import MenuView from './view/menu-view';
import SortView from  './view/sort-view';
import FilmsView from './view/films-view';
import CardFilmView from './view/card-film-view';
import FilmsBoardView from './view/films-board-view';
import FooterView from './view/footer-view';
import ButtonShowMoreView from './view/button-show-more';
import PopupFilmInfoView from './view/popup-film-info-view';
import {RenderPosition, renderElement} from './render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateCountFilms} from './mock/films-state';
import PopupContainerView from './view/popup-container-view';
import {generateComment} from './mock/comment';
import CommentPopupView from './view/comment-view';
import NewCommentView from './view/new-comment-view';
import {generateFilters} from './mock/filters';
import CommentsContainerView from './view/popup-comments-view';
import PopupButtonCloseView from './view/popup-button-close-view';
import PopupReactionsView from './view/popup-reactions-view';

const CARD_COUNT = 25;
const CARDS_COUNT_PER_STEP = 5;
const CARDS_FILM_COUNT = 2;
const COMMENT_STATE_COUNT = 4;

const cards = Array.from({length: CARD_COUNT}, generateCardFilm);
const comments = Array.from({length: COMMENT_STATE_COUNT}, generateComment);
const filters = generateFilters(cards);

const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP: {title: 'Top rated', isExtra: true},
  MOST_COMMENT: {title: 'Most commented', isExtra: true},
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

renderElement(siteHeaderElement, new ProfileView().element);
renderElement(siteMainElement, new MenuView(filters).element);
renderElement(siteMainElement, new SortView().element);

renderElement(siteMainElement, new FilmsBoardView().element);

const filmsBoardElement = siteMainElement.querySelector('.films');

const getFilmsTemplate = (title, state) => new FilmsView(title, state);

renderElement(filmsBoardElement, getFilmsTemplate(FilmsInfo.ALL.title, FilmsInfo.ALL.isExtra).element);

const filmsCardContainer = filmsBoardElement.querySelector('.films-list');
const filmsCardList = filmsBoardElement.querySelector('.films-list__container');

for (let i = 1; i <= Math.min(cards.length, CARDS_COUNT_PER_STEP); i++) {
  renderElement(filmsCardList, new CardFilmView(cards[i]).element);
}

if (cards.length > CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  renderElement(filmsCardContainer, new ButtonShowMoreView().element);

  const showMoreButton = filmsCardContainer.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    cards
      .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
      .forEach((card) => renderElement(filmsCardList, new CardFilmView(card).element));

    renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (renderedCardsCount >= cards.length) {
      showMoreButton.remove();
    }
  });
}

renderElement(filmsBoardElement, getFilmsTemplate(FilmsInfo.TOP.title, FilmsInfo.TOP.isExtra).element);
renderElement(filmsBoardElement, getFilmsTemplate(FilmsInfo.MOST_COMMENT.title, FilmsInfo.MOST_COMMENT.isExtra).element);

const filmsExtraContainers = siteMainElement.querySelectorAll('.films-list--extra .films-list__container');

for (const filmsExtraContainer of filmsExtraContainers) {
  for (let i = 0; i < CARDS_FILM_COUNT; i++) {
    renderElement(filmsExtraContainer, new CardFilmView(cards[i]).element);
  }
}

renderElement(siteFooterElement, new FooterView(generateCountFilms()).element);

const cardFilmLinkElements = document.querySelectorAll('.film-card__link');

const renderPopup = () => {
  renderElement(siteFooterElement, new PopupContainerView().element, RenderPosition.AFTER_END);

  const popupTemplate = document.querySelector('.film-details');
  const popupFilmInfoTemplate = popupTemplate.querySelector('.film-details__top-container');
  const popupCommentsTemplate = popupTemplate.querySelector('.film-details__bottom-container');

  renderElement(popupFilmInfoTemplate, new PopupButtonCloseView().element);
  renderElement(popupFilmInfoTemplate, new PopupFilmInfoView(cards[0]).element);
  renderElement(popupFilmInfoTemplate, new PopupReactionsView(cards[0]).element);
  renderElement(popupCommentsTemplate, new CommentsContainerView().element);

  const popupCommentsList = popupCommentsTemplate.querySelector('.film-details__comments-list');
  const popupNewCommentContainer = popupCommentsTemplate.querySelector('.film-details__comments-wrap');

  comments.forEach((comment) => renderElement(popupCommentsList, new CommentPopupView(comment).element));

  renderElement(popupNewCommentContainer, new NewCommentView().element);
};

cardFilmLinkElements.forEach((cardFilmLinkElement) => cardFilmLinkElement
  .addEventListener('click', (evt) => {
    evt.preventDefault();
    renderPopup();
  })
);
