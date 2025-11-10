import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieCard.css";

function Moviecard({ movie }) {
  // FIX: Mengganti 'addToFavorite' menjadi 'addFavorites'
  const { isFavorite, addFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  function onfavoriteClick(e) {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      // FIX: Memanggil fungsi yang benar
      addFavorites(movie);
    }
  }

  return (
    <>
      <div className="movie-card">
        <div className="movie-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <div>
            <button
              className={`favorite-btn ${favorite ? "active" : ""}`}
              onClick={onfavoriteClick}
            >
              {favorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </>
  );
}

export default Moviecard;
