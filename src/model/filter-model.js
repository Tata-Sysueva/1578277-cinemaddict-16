import AbstractObservable from '../abstract-observable';
import { FilterType } from '../const';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;

    this._notify(updateType, filter);
  }
}
