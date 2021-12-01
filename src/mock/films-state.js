import {getRandomInteger} from '../until';

export const generateCountFilms = () => ({
  countWishlistFilms: getRandomInteger(0, 100),
  countHistoryFilms: getRandomInteger(0, 100),
  countFavoritesFilms: getRandomInteger(0, 100),
  countAllFilms: getRandomInteger(0, 200000),
});
