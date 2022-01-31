import SmartView from './smart-view';
import dayjs from 'dayjs';
import {
  colorsChart,
  countGenresInRange,
  getFilmsInRange,
  getGenresInRange,
  getRank,
  getTopGenre,
} from '../utils';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const statisticsItems = [
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
];

const createStatisticsFiltersItem = ({ name, type }) => (
  `<input
      type="radio"
      class="statistic__filters-input visually-hidden"
      name="statistic-filter"
      id="statistic-${type}"
      value="${type}"
      ${type === 'all-time'? 'checked' : ' '}
    >
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>`
);

const renderChart = (genresCtx, dateFrom, dateTo, films) => {
  const genres = getGenresInRange(films, dateFrom, dateTo);
  const genresStats = countGenresInRange(genres);
  const labels = Object.keys(genresStats);
  const labelsData = Object.values(genresStats);

  genresCtx.height = BAR_HEIGHT * labels.length;

  if (!labels.length) {
    return;
  }

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data: labelsData,
        backgroundColor: colorsChart.yellow,
        hoverBackgroundColor: colorsChart.yellow,
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: colorsChart.white,
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: colorsChart.white,
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
  const { films, dateFrom, dateTo } = data;
  const filmsWatched = getFilmsInRange(films, dateFrom, dateTo);

  const countFilmsWatched = filmsWatched.length;
  const topGenre = countFilmsWatched ? getTopGenre(films, dateFrom, dateTo) : ' ';
  let runTime = 0;

  filmsWatched.forEach((film) => {
    runTime = runTime + film.filmInfo.runtime;

    return runTime;
  });

  // const countTotalFilmsWatched = (filmsWatched) => filmsWatched.reduce((runTime, curFilm) => {
  //   runTime = curFilm.filmInfo.runtime++;
  //
  //   return runTime;
  // }, runTime);
  //
  // const totalRunTime = countTotalFilmsWatched(filmsWatched);

  const runTimeHour = Math.floor(runTime/60);
  const runTimeMinutes = Math.round(runTime - (runTimeHour * 60));

  const rank = getRank(countFilmsWatched);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label"> ${ rank } </span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${statisticsItems.map((filter) => createStatisticsFiltersItem(filter)).join('')}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${ countFilmsWatched } <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">
          ${ runTimeHour } <span class="statistic__item-description">h</span>
          ${ runTimeMinutes } <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${ topGenre }</p>
      </li>
    </ul>

    <!-- Пример диаграммы -->

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatisticsView extends SmartView {
  #genresChart = null;
  #selectedItem = null;

  constructor(films) {
    super();
    this._data = {
      films,

      dateFrom: dayjs().subtract(25, 'year').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#setStatFilterTypeChangeHandler();
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setStatFilterTypeChangeHandler();
    this.#setDateItem();
  }

  #setDateItem = () => {
    const item = this.element.querySelector(`[value=${this.#selectedItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }

  #setStatFilterTypeChangeHandler = () => {
    const statisticItems = this.element.querySelectorAll('.statistic__filters-input');
    statisticItems.forEach((item) => item.addEventListener('change', this.#dateChangeHandler));
  }

  #dateChangeHandler = (evt) => {
    evt.preventDefault();

    const dateTo = dayjs().toDate();
    let dateFrom;

    switch (evt.target.value) {
      case 'all-time':
        this.#selectedItem = 'all-time';
        dateFrom = dayjs().subtract(25, 'year').toDate();
        break;
      case 'today':
        this.#selectedItem = 'today';
        dateFrom = dayjs().subtract(24, 'hour').toDate();
        break;
      case 'week':
        this.#selectedItem = 'week';
        dateFrom = dayjs().subtract(7, 'day').toDate();
        break;
      case 'month':
        this.#selectedItem = 'month';
        dateFrom = dayjs().subtract(1, 'month').toDate();
        break;
      case 'year':
        this.#selectedItem = 'year';
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
    const genresCtx = this.element.querySelector('.statistic__chart');

    this.#genresChart = renderChart(genresCtx, dateFrom, dateTo, films);
  }
}
