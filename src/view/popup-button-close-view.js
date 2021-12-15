import AbstractView from './abstract-view';

const createPopupButtonClose = () =>(
  `<div class="film-details__close">
    <button class="film-details__close-btn" type="button">close</button>
  </div>`
);

export default class PopupButtonCloseView extends AbstractView {
  get template() {
    return createPopupButtonClose();
  }
}
