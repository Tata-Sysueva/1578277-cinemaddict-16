import {getRandomInteger} from '../util';

export const generateCountFilms = () => ({
  countAllFilms: getRandomInteger(0, 200000),
});
