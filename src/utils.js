const FilmsSortType = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
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

const getSortedFilms = (films, sortType) => {
  switch (sortType) {
    case FilmsSortType.TOP_RATED:
      return films.slice().sort((a, b) => b.rating - a.rating);
    case FilmsSortType.MOST_COMMENTED:
      return films.slice().sort((a, b) => b.comments - a.comments);
    default:
      throw new Error(`Unknown sort type ${sortType}`);
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
  FilmsSortType,
  getSortedFilms,
  updateItem,
};
