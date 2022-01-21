import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

export const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
  BY_COMMENTED: 'most commented',
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

export const unique = (arr) => {
  let result = [];

  for (let elem of arr) {
    if (!result.includes(elem)) {
      result.push(elem);
    }
  }

  return result;
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const getValues = (array, commentId) => {
  return array.filter((commentInfo) => commentInfo.id === commentId);
}

export const SortFilmsComments = (a, b) => b.comments.length - a.comments.length;
export const SortFilmsRelease = (a, b) => b.filmInfo.release.date - a.filmInfo.release.date;
export const SortFilmsRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const countCompletedFilmInDateRange = (films, dateFrom, dateTo) =>
  films.reduce((counter, film) => {
    const { watchingDate } = film.userDetails;

    if (watchingDate === null) {
      return counter;
    }

    if (
      dayjs(watchingDate).isSame(dateFrom) ||
      dayjs(watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(watchingDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);

const initialGenres = {
  musical: 0,
  western: 0,
  drama: 0,
  comedy: 0,
  mystery: 0,
  filmNoir: 0,
};

export const countFilmsInDateRange = (genres) => genres.reduce((acc, curGenre) => {
  if (curGenre === 'Musical') {
    acc.musical++;
  }

  if (curGenre === 'Western') {
    acc.western++;
  }

  if (curGenre === 'Drama') {
    acc.drama++;
  }

  if (curGenre === 'Comedy') {
    acc.comedy++;
  }

  if (curGenre === 'Mystery') {
    acc.mystery++;
  }

  if (curGenre === 'Film-Noir') {
    acc.filmNoir++;
  }

  return  acc;
}, initialGenres);

export const getGenresInRange = (films, dateFrom, dateTo) => {
  let genres = [];

  films.filter((film) => {
    const { watchingDate } = film.userDetails;

    if (
      dayjs(watchingDate).isSame(dateFrom) ||
      dayjs(watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(watchingDate).isSame(dateTo)
    ) {
      films.forEach((film) => {
        genres = [...genres, ...film.filmInfo.genres];
      })
    }

  } )

  return genres;
};

export const colorsChart = {
  yellow: '#ffe800',
  white: '#ffffff',
}

export const getCountsFilmsGenres = () => {
  const countsFilmsGenres = [];
  for (let genre in initialGenres) {
    if (initialGenres[genre] !== 0) {
      countsFilmsGenres.push(initialGenres[genre]);
    }
  }
  countsFilmsGenres.sort((a, b) => b - a);

  return countsFilmsGenres;
}

export {
  getRandomInteger,
  getFloatingPointNumber,
  getRandomArrayElement,
  createRandomArr,
  uppercaseFirstLetter,
  isEscapeKey,
  //getSortedFilms,
};
