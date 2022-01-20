import SmartView from './smart-view';
import {filter} from '../filters';
import {FilterType} from '../const';
import dayjs from 'dayjs';
import {countCompletedFilmInDateRange, getGenresInRange, unique} from '../utils';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const StatisticsItems = [
  {
    type: 'all-time',
    name: 'All time',
  },
  {
    type: 'today',
    name: 'Today',
  },
  {
    type: 'week',
    name: 'Week',
  },
  {
    type: 'month',
    name: 'Month',
  },
  {
    type: 'year',
    name: 'Year',
  },
]

const createStatisticsFiltersItem = ({ name, type }) => (
`  <input
      type="radio"
      class="statistic__filters-input visually-hidden"
      name="statistic-filter"
      id="statistic-${type}"
      value="${type}"
      ${type === 'all-time'? 'checked' : ' '}
    >
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
)

const renderGenresChart = (genresCtx, films, dateFrom, dateTo) => {
  const genres = unique(getGenresInRange(films, dateFrom, dateTo));

  return new Chart(document.querySelector('.statistic__chart'), {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [
        'Musical',
        'Western',
        'Drama',
        'Comedy',
        'Mystery',
        'Film-Noir',
      ], // сюда подставить genres
      datasets: [
        {
          data: [11, 8, 7, 4, 3, 1], // сюда передать количество фильмов по каждому жанру, длинна массива должна быть такой же как  genres.length
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }
      ],
    },
    options: {
      responsive: false,
      plugins: {
        dataLabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data) => {
  const {films, dateFrom, dateTo} = data;

  //функция должна 1) пройтись по массиву с объектами о фильме
  // 2) проверять, в каких объектах с данными о фильме поле с датой просмотра соответствует выбранному диапозону
  // 3) пушить их в новый массив, длинна которого и будет 'You watched'
  //доделать
  const completedFilmCount = countCompletedFilmInDateRange(films, dateFrom, dateTo);

  //как вычислить общее время просмотра (сумма значений ключей film.filmInfo.duration 'нового массива' ?)
  // как вычислить топ жанр (пройти по 'новому массиву', достать из него значения ключей film.filmInfo.genres
  // и сделать из них один большой массив, потом проверить какой жанр в этом массиве повторяется чаще всего — как?
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${StatisticsItems.map((filter) => createStatisticsFiltersItem(filter)).join('')}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${completedFilmCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">69 <span class="statistic__item-description">h</span> 41 <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Drama</p>
      </li>
    </ul>

    <!-- Пример диаграммы -->

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
};

export default class StatisticsView extends SmartView {
  #genresChart = null;

  constructor(films) {
    super();

    this._data = {
      films,

     // всё время — это с какой даты?
      dateTo: dayjs().toDate(),
      dateFrom: dayjs().subtract(7, 'day').toDate(),
    };

    this.#setCharts()
  }



  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#genresChart) {
      this.#genresChart.remove();
      this.#genresChart = null;
    }
  }


  restoreHandlers = () => {
    this.#setCharts();
  }

  // Настроить выбор периода, за который нужно выбрать статистику

  setStatFilterTypeChangeHandler = () => {
    this.element.addEventListener('change', this.#dateChangeHandler);
  }

  #dateChangeHandler = (evt) => {
    evt.preventDefault();

    const dateTo = dayjs().toDate();
    let dateFrom;

    switch (evt.target.value) {
      case 'all-time':
        return console.log('Всё время');
      case 'today':
        dateFrom = dayjs().subtract(24, 'hour').toDate();
        break;
      case 'week':
        dateFrom = dayjs().subtract(7, 'day').toDate();
        break;
      case 'month':
        dateFrom = dayjs().subtract(1, 'month').toDate();
        break;
      case 'year':
        dateFrom = dayjs().subtract(1, 'year').toDate();
        break;
      default:
        throw new Error ('Can\'t find this value');
    }

    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
    });
  }

  #setCharts = () => {
    const {films, dateFrom, dateTo} = this._data;
    const genresCtx = this.element.querySelector('.statistic__chart')

    this.#genresChart = renderGenresChart(genresCtx, films, dateFrom, dateTo);
  }
}
