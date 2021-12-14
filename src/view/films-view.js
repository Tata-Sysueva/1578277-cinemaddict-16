import AbstractView from './abstract-view';

const createFilmsTemplate = (title, isExtra = true) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ' '}">
    <h2 class="films-list__title ${!isExtra ? 'visually-hidden' : ' '}">${title}</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmsView extends AbstractView {
  #title = null;
  #isExtra = null;

  constructor(title, isExtra) {
    super();
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get template() {
    return createFilmsTemplate(this.#title, this.#isExtra);
  }
}
