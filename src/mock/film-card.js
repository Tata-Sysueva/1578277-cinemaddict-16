import {
  getRandomInteger,
  getRandomArrayElement,
  getFloatingPointNumber,
  createRandomArr} from '../utils';

import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const IMAGES = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Mystery',
  'Film-Noir',
];

const AGES = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+',
];

const DIRECTORS = [
  'Anthony Mann',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Erich von Stroheim ',
  'Mary Beth Hughes',
  'Dan Duryea',
];

const WRITERS = [
  'Anthony Wigton',
  'Anne Weil',
  'Heinz Hughes',
  'Richard Mann',
  'Erich von Duryea',
  'Mary Beth Herald',
  'Dan Stroheim ',
];

const ACTORS = [
  'Anne Wigton',
  'Dan Weil',
  'Erich Hughes',
  'Richard Mann',
  'Anthony von Duryea',
  'Anne Beth Herald',
  'Mary Stroheim',
];

const COUNTRIES = [
  'Russia',
  'USA',
  'Germany',
  'Italy',
  'Poland',
];

const COMMENTS = [];

for (let i = 0; i < getRandomInteger(0, 100); i++ ) {
  COMMENTS.push(`${getRandomInteger(0, 1000)}`);
}

const generateDuration = (time) =>Math.floor(time / 60);

const generateDate = () => {
  const randomDay = getRandomInteger(1, 7);
  const randomMonth = getRandomInteger(0, 11);
  const randomYear = getRandomInteger(-100, 0);
  return dayjs().add(randomDay, 'day').add(randomMonth, 'month').add(randomYear, 'year').format('DD MMMM YYYY');
};

export const generateCardFilm = () => ({
  // id: nanoid(),
  // title: getRandomArrayElement(TITLES),
  // rating: getFloatingPointNumber(),
  // year: getRandomInteger(1900, 1980),
  // duration: generateDuration(getRandomInteger(60, 300)),
  // genre: getRandomArrayElement(GENRES),
  // genres: createRandomArr(GENRES),
  // image: getRandomArrayElement(IMAGES),
  // description: getRandomArrayElement(DESCRIPTIONS),
  // comments: createRandomArr(COMMENTS).length,
  // age: getRandomArrayElement(AGES),
  // director: getRandomArrayElement(DIRECTORS),
  // actors: createRandomArr(ACTORS),
  // writers: createRandomArr(WRITERS),
  // country: getRandomArrayElement(COUNTRIES),
  // date: generateDate(),
  // watchlist: Boolean(getRandomInteger(0, 1)),
  // alreadyWatched: Boolean(getRandomInteger(0, 1)),
  // favorite: Boolean(getRandomInteger(0, 1)),

  id: nanoid(),
  comments: createRandomArr(COMMENTS).length,
  filmInfo: {
    title: getRandomArrayElement(TITLES),
    alternativeTitle: getRandomArrayElement(TITLES),
    totalRating: getFloatingPointNumber(),
    poster: getRandomArrayElement(IMAGES),
    ageRating: getRandomArrayElement(AGES),
    director: getRandomArrayElement(DIRECTORS),
    writers: createRandomArr(WRITERS),
    actors: createRandomArr(ACTORS),
    release: {
      date: getRandomInteger(1900, 1980),
      releaseCountry: getRandomArrayElement(COUNTRIES),
    },
    runtime: generateDuration(getRandomInteger(60, 300)),
    genre: getRandomArrayElement(GENRES),
    genres: createRandomArr(GENRES),
    description: getRandomArrayElement(DESCRIPTIONS),
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateDate(),
    favorite: Boolean(getRandomInteger(0, 1)),
  }
});
