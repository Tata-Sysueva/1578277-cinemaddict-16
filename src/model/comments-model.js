import AbstractObservable from '../abstract-observable';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
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
  }

  // addComment = (updateType, data) => {
  //   const newComment = this.generateNewComment(data);
  //
  //   this.#comments = [newComment, ...this.#comments];
  //
  //   this._notify(updateType, newComment);
  // };

  deleteComment = (updateType, commentId) => {
    // const index = this.#comments.findIndex((comment) => comment.id === updatedCommentId);
//
// if (index === -1) {
//   showAlert('Can\'t delete unexisting comment');
// }
//
// try {
//   await this.#apiService.deleteComment(updatedCommentId);
//   this.#comments.splice(index, 1);
//
//   this._notify(updateType);
// } catch(err) {
//   showAlert('Can\'t delete comment');
// }

    this.#comments = this.#comments.filter(({ id }) => id !== commentId);

    this._notify(updateType);
  }
}

