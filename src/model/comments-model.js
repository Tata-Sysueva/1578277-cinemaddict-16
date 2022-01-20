import AbstractObservable from '../abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  set comments(comments) {
    this.#comments = [...comments];
  }
  get comments() {
    return this.#comments;
  }

  addComment = (updateType, data) => {
    const newComment = this.generateNewComment(data);
    //должен быть ещё пуш в filmInfo.comments filmsInfo.comments.push(newComment.id)?
    this.#comments = [newComment, ...this.#comments];

    this._notify(updateType, newComment);
  };

  deleteComment = (updateType, commentId) => {
    this.#comments = this.#comments.filter(({ id }) => id !== commentId);

    this._notify(updateType);
  }
}
