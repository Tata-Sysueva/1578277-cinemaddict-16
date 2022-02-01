import AbstractObservable from '../abstract-observable';
import { adaptToClient } from '../utils';

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

  addComment = async (updateType, update, position) => {
    try {
      const { movie, comments } = await this.#apiService.addComment(update.filmId, update.newComment);
      const updatedFilm = adaptToClient(movie);
      this.#comments = comments;
      this._notify(updateType, updatedFilm, position);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, {commentId, film}, position) => {
    try {
      await this.#apiService.deleteComment(commentId);

      this.#comments = this.#comments.filter(({id}) => id !== commentId);
      const commentsIds = this.#comments.map(({ id }) => id);

      const updatedFilm = {...film, comments: commentsIds };
      this._notify(updateType, updatedFilm, position);
    } catch (err) {
      throw new Error(`Can't delete comment ${commentId}. Error: ${err}`);
    }
  }
}
