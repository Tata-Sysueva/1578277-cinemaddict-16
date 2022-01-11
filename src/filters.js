// const initialFilters = {
//   watchlist: 0,
//   history: 0,
//   favorites: 0,
// };
//
// export const generateFilters = (films) => films.reduce((acc, curFilm) => {
//   if (curFilm.userDetails.watchlist) {
//     acc.watchlist++;
//   }
//
//   if (curFilm.userDetails.alreadyWatched) {
//     acc.history++;
//   }
//
//   if (curFilm.userDetails.favorite) {
//     acc.favorites++;
//   }
//
//   return acc;
// }, initialFilters);

import {FilterType} from './const';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};
