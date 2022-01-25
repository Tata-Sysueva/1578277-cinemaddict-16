import {getRandomArrayElement, getRandomInteger} from '../utils';
import dayjs from 'dayjs';

const author = [
  'Vladimir Lenin',
  'Iosif Stalin',
  'George Malenkov',
  'Nikita Hrusciov',
  'Leonid Brezhnev'
];

const text = [
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

const reaction = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const generateDate = () => {
  const randomHour = getRandomInteger(0, 24);
  const randomMinutes = getRandomInteger(0, 24);
  const randomDay = getRandomInteger(1, 7);
  const randomMonth = getRandomInteger(0, 11);
  const randomYear = getRandomInteger(-10, 0);
  return dayjs()
    .add(randomHour, 'hour')
    .add(randomMinutes, 'minutes')
    .add(randomDay, 'day')
    .add(randomMonth, 'month')
    .add(randomYear, 'year')
    .format('YYYY/MM/DD hh:mm');
};

export const generateNewComment = (count) => ({
  id: count,
  author: getRandomArrayElement(author),
  comment: getRandomArrayElement(text),
  date: generateDate(),
  emotion: getRandomArrayElement(reaction),
});

export const getCommentArray = () => Array.from({length: 10},
  (item, count) => generateNewComment(count + 1)
);
