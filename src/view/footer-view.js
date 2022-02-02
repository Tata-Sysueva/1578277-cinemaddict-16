import AbstractView from './abstract-view';

const createFooterTemplate = (filmsCounter) => (
  `<section class="footer__statistics">
    <p>${filmsCounter} movies inside</p>
  </section>`
);

export default class FooterView extends AbstractView {
  #counter = null;

  constructor(counter) {
    super();
    this.#counter = counter;
  }

  get template() {
    return createFooterTemplate(this.#counter);
  }
}
