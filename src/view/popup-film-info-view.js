export const createFilmInfoTemplate = () => (
  `<div class="film-details__close">
     <button class="film-details__close-btn" type="button">close</button>
   </div>

   // Информация о фильме

   <section class="film-details__controls">
     <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
     <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
     <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
   </section>`
);
