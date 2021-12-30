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

const getSortedFilms = (films, sortType, sourcedFilms) => {
  switch (sortType) {
    case SortType.BY_COMMENTED:
      return films.slice().sort((a, b) => b.comments.length - a.comments.length);
    case SortType.BY_DATE:
      return films.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
    case SortType.BY_RATING:
      return films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    default:
      films = sourcedFilms;
  }
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {
  getRandomInteger,
  getFloatingPointNumber,
  getRandomArrayElement,
  createRandomArr,
  uppercaseFirstLetter,
  isEscapeKey,
  getSortedFilms,
  updateItem,
};
