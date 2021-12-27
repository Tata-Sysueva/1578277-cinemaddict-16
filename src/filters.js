const initialFilters = {
  watchlist: 0,
  history: 0,
  favorites: 0,
};

export const generateFilters = (films) => films.reduce((acc, curFilm) => {
  if (curFilm.userDetails.watchlist) {
    acc.watchlist++;
  }

  if (curFilm.userDetails.alreadyWatched) {
    acc.history++;
  }

  if (curFilm.userDetails.favorite) {
    acc.favorites++;
  }

  return acc;
}, initialFilters);
