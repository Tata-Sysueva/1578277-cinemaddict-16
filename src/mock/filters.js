const initialFilters = {
  watchlist: 0,
  history: 0,
  favorites: 0,
};

export const generateFilters = (films) => {
  let counterWatchlist = 0;
  let counterHistory = 0;
  let counterFavorites = 0;

  for (let i = 0; i < films.length; i++) {
    const film = films[i];

    film.watchlist ? initialFilters.watchlist = ++counterWatchlist : counterWatchlist;
    film.alreadyWatched ? initialFilters.history = ++counterHistory : counterHistory;
    film.favorite ? initialFilters.favorites = ++counterFavorites : counterFavorites;
  }

  return initialFilters;
};
