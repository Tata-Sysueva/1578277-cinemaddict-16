export const AUTHORIZATION = 'Basic c4320a476d34d4bba63f4c6c2d6bdc';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export const BAR_HEIGHT = 50;
export const MAX_LENGTH_DESCRIPTION = 140;
export const SHAKE_ANIMATION_TIMEOUT = 600;

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
  BY_COMMENTED: 'most commented',
};

export const FilmsInfo = {
  ALL: {title: 'All movies. Upcoming', isExtra: false},
  TOP_RATED: {title: 'Top rated', isExtra: true},
  MOST_COMMENTED: {title: 'Most commented', isExtra: true},
  EMPTY_ALL: {title: 'There are no movies in our database', isExtra: true},
  EMPTY_WATCHLIST: {title: 'There are no movies to watch now', isExtra: true},
  EMPTY_HISTORY: {title: 'There are no watched movies now', isExtra: true},
  EMPTY_FAVORITES: {title: 'There are no favorite movies now', isExtra: true},
  LOADING: {title: 'Loading...', isExtra: false},
};

export const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_FILM_TO_WATCHLIST: 'ADD_FILM_TO_WATCHLIST',
  MARK_FILM_AS_WATCHED: 'MARK_FILM_AS_WATCHED',
  MARK_FILM_AS_FAVORITE: 'MARK_FILM_AS_FAVORITE',
};

export const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  DESTROY: 'DESTROY',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATISTICS: 'stats',
};

export const ControlType = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITE: 'favorite',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  OPENING: 'OPENING',
};

export const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const BLANK_COMMENT = {
  text: '',
  emotion: EMOJIS[0],
};
