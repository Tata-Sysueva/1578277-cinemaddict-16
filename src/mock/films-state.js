import {getRandomInteger} from '../utils';

export const generateCountFilms = () => ({
  countAllFilms: getRandomInteger(0, 200000),
});
