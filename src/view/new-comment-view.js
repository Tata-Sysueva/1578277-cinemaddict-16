import SmartView from './smart-view';

const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const BLANK_COMMENT = {
  text: '',
  emotion: EMOJIS[0],
};

const createEmojiList = (activeEmotion) => (
  `<div class="film-details__emoji-list">
    ${EMOJIS.map((emoji) => (
    `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emoji}"
      value="${emoji}"
      ${emoji === activeEmotion ? 'checked' : ''}
    >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join('')}
  </div>`
);

const createNewComment = ({ text, emotion }) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
    </label>

  ${createEmojiList(emotion)}
  </div>`
);

export default class NewCommentView extends SmartView {
  constructor(comment = BLANK_COMMENT) {
    super();
    this._data = NewCommentView.parseCommentToDate(comment);

    this.#setInnerHandlers();
  }

  get template() {
    return createNewComment(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((emojiInput) => emojiInput.addEventListener('click', this.#emojiClickHandler));

    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#descriptionInputHandler);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

  static parseCommentToDate = (data) => ({...data})
}
