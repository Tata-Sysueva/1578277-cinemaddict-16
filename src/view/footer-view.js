export const createFooterTemplate = (filmsState) => {
  const {countAllFilms} = filmsState;

  return `<section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      <p>${countAllFilms} movies inside</p>
    </section>`;
};
