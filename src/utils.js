import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
  BY_COMMENTED: 'most commented',
};

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

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getFloatingPointNumber = (min = 0, max = 10, exp = 1) => Number((Math.random() * (max - min) + min).toFixed(exp));

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const shuffle = (array) => {
  const copyArray = array.slice();

  for (let i = copyArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copyArray[i], copyArray[j]] = [copyArray[j], copyArray[i]];
  }

  return array;
};

const createRandomArr = (array) => shuffle(array).slice(0, getRandomInteger(0, array.length - 1));

const uppercaseFirstLetter = (string) => string.slice(0,1).toUpperCase() + string.slice(1);

const isEscapeKey = (evt) => evt.key === 'Escape';

export const SortFilmsComments = (a, b) => b.comments.length - a.comments.length;
export const SortFilmsRelease = (a, b) => b.filmInfo.release.date - a.filmInfo.release.date;
export const SortFilmsRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

export const getSortedFilms = (films, sortType, sourcedFilms) => {
  switch (sortType) {
    case SortType.BY_COMMENTED:
      return films.sort(SortFilmsComments);
    case SortType.BY_DATE:
      return films.sort(SortFilmsRelease);
    case SortType.BY_RATING:
      return films.sort(SortFilmsRating);
    default:
      films = sourcedFilms;
  }
};

export const getValues = (array, commentId) => array.filter((commentInfo) => commentInfo.id === commentId);

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
    const { watchingDate } = film.userDetails;
    if (
      dayjs(watchingDate).isSame(dateFrom) ||
      dayjs(watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(watchingDate).isSame(dateTo) &&
      film.userDetails.alreadyWatched
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

export {
  getRandomInteger,
  getFloatingPointNumber,
  getRandomArrayElement,
  createRandomArr,
  uppercaseFirstLetter,
  isEscapeKey,
};
