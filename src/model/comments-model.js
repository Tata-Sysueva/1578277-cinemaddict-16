import AbstractObservable from '../abstract-observable';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#apiService.getComments(film.id);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  }

  // addComment = (updateType, data) => {
  //   const newComment = this.generateNewComment(data);
  //   //должен быть ещё пуш в filmInfo.comments filmsInfo.comments.push(newComment.id)?
  //   this.#comments = [newComment, ...this.#comments];
  //
  //   this._notify(updateType, newComment);
  // };

  deleteComment = (updateType, commentId) => {
    this.#comments = this.#comments.filter(({ id }) => id !== commentId);

    this._notify(updateType);
  }
}
