const initialFilters = {
  watchlist: 0,
  history: 0,
  favorites: 0,
};

export const generateFilters = (films) => films.reduce((acc, curFilm) => {
  if (curFilm.watchlist) {
    acc.watchlist++;
  }

  if (curFilm.alreadyWatched) {
    acc.history++;
  }

  if (curFilm.favorite) {
    acc.favorites++;
  }

  return acc;
}, initialFilters);
