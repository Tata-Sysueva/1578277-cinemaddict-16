import AbstractView from './abstract-view';

const createButtonShowMore = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMore();
  }

  setOnShowMoreButtonClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onShowMoreButtonClick);
  }

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
