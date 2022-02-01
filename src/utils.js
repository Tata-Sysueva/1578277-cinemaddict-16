import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const colorsChart = {
  yellow: '#ffe800',
  white: '#ffffff',
};

const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fun',
  MOVIE_BUFF: 'Movie Buff',
};

const RankLevel = {
  NOVICE: 10,
  FAN: 20,
};

export const adaptToClient = (film) => {
  const release = {
    date: film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : film['film_info']['release']['date'],
    releaseCountry: film['film_info']['release']['release_country'],
  };

  const filmInfo = {
    title: film['film_info']['title'],
    alternativeTitle: film['film_info']['alternative_title'],
    totalRating: film['film_info']['total_rating'],
    poster: film['film_info']['poster'],
    ageRating: film['film_info']['age_rating'],
    director: film['film_info']['director'],
    writers: film['film_info']['writers'],
    actors: film['film_info']['actors'],
    release: release,
    genres: film['film_info']['genre'],
    runtime: film['film_info']['runtime'],
    description: film['film_info']['description'],
  };

  const userDetails = {
    watchlist: film['user_details']['watchlist'],
    alreadyWatched: film['user_details']['already_watched'],
    watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
    favorite: film['user_details']['favorite'],
  };

  const adaptedFilm = {...film,
    filmInfo,
    userDetails,
  };

  delete adaptedFilm['user_details'];
  delete adaptedFilm['film_info'];

  return adaptedFilm;
};

export const uppercaseFirstLetter = (string) => string.slice(0,1).toUpperCase() + string.slice(1);

export const isEscapeKey = (evt) => evt.key === 'Escape';

let isControl = false;

export const isCtrlEnterEvent = (evt) => {
  if (evt.key === 'Control') {
    isControl = true;
  }

  if (isControl && evt.key === 'Enter') {
    return true;
  }
};

export const SortFilmsRelease = (a, b) => b.filmInfo.release.date - a.filmInfo.release.date;

export const SortFilmsRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

export const countGenresInRange = (genres) => genres.reduce((acc, curGenre) => {
  if (!acc[curGenre]) {
    acc[curGenre] = 1;
  } else {
    acc[curGenre]++;
  }

  return  acc;
}, {});

export const getGenresInRange = (films, dateFrom, dateTo) => {
  const genres = [];

  films.forEach((film) => {
    const { watchingDate } = film.userDetails;

    if (
      dayjs(watchingDate).isSame(dateFrom) ||
      dayjs(watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(watchingDate).isSame(dateTo)
    ) {
      genres.push(film.filmInfo.genres);
    }
  });
  return genres.flat();
};

export const getTopGenre = (films, dateFrom, dateTo) => {
  const genres = getGenresInRange(films, dateFrom, dateTo);
  const genresStats = countGenresInRange(genres);
  const labelsData = Object.values(genresStats);
  const genresValue = Math.max.apply(null, labelsData);

  return Object.keys(genresStats).find((key) => genresStats[key] === genresValue);
};

export const getFilmsInRange = (films, dateFrom, dateTo) => {
  const filmsInRange = [];

  films.filter((film) => {
    const { watchingDate, alreadyWatched } = film.userDetails;

    if (
      dayjs(watchingDate).isSame(dateFrom) ||
      dayjs(watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(watchingDate).isSame(dateTo) &&
      alreadyWatched
    ) {
      filmsInRange.push(film);
    }
  });
  return filmsInRange;
};

export const getRank = (films) => {
  if (!films) {
    return '';
  } else if (films <= RankLevel.NOVICE) {
    return Ranks.NOVICE;
  } else if ((films > RankLevel.NOVICE) && (films <= RankLevel.FAN) ) {
    return Ranks.FAN;
  }
  return Ranks.MOVIE_BUFF;
};
