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
    if (film.userDetails.watchingDate === null) {
      return counter;
    }

    // const { watchingDate } = film.userDetails;
    // if (watchingDate === null) {
    //   return counter;
    // }

    // С помощью day.js проверям, сколько задач с дедлайном
    // попадают в диапазон дат
    if (
      dayjs(film.userDetails.watchingDate).isSame(dateFrom) ||
      dayjs(film.userDetails.watchingDate).isBetween(dateFrom, dateTo) ||
      dayjs(film.userDetails.watchingDate).isSame(dateTo)
    ) {
      return counter + 1;
    }

    return counter;
  }, 0);

export const countFilmsInDateRange = (films) => {
// посчитать, сколько фильмов каждого жанра было просмотрено
  // пройтись по всем всему массиву с объектами films и проверять, если в объекте есть массив в котором есть нужный мне жанр, то увеличивать счётчик на единицу
  //как понять, какие мне жанры нужны
  //нужны те, что возвращает getGenresInRange
  //может использовать ф-ю что была раньше для фильтрации? или просто филтрацию
};

export const getGenresInRange = ({ films, dateFrom, dateTo }) => {
  let genres = [];
  const stepDate = new Date(dateFrom);

  while (dayjs(stepDate).isSameOrBefore(dateTo)) {
    films.forEach((film) => {
       genres = [...film.filmInfo.genres];
    })
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return genres;
};

export {
  getRandomInteger,
  getFloatingPointNumber,
  getRandomArrayElement,
  createRandomArr,
  uppercaseFirstLetter,
  isEscapeKey,
  //getSortedFilms,
};
