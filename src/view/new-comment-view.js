import SmartView from './smart-view';

const createNewComment = () => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label"></div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`
);

export default class NewCommentView extends SmartView {
  constructor() {
    super();
    this.#setInnerHandlers();
  }

  get template() {
    return createNewComment();
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('#emoji-smile')
      .addEventListener('click', this.#emojiToggleHandler);
    this.element.querySelector('#emoji-sleeping')
      .addEventListener('click', this.#emojiToggleHandler);
    this.element.querySelector('#emoji-puke')
      .addEventListener('click', this.#emojiToggleHandler);
    this.element.querySelector('#emoji-angry')
      .addEventListener('click', this.#emojiToggleHandler);
  }

  #emojiToggleHandler = (evt) => {
    const emoji = evt.target.id.replace('emoji-','');
    const newEmoji = `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="${evt.target.id}">`;
    const emojiContainer = this.element.querySelector('.film-details__add-emoji-label');

    if (emojiContainer.firstChild) {
      emojiContainer.removeChild(emojiContainer.firstChild);
    }

    emojiContainer.insertAdjacentHTML('beforeend', newEmoji);
  }
}
