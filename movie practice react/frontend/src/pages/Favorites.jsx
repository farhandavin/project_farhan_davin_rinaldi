import "../css/Favorite.css";
import { useMovieContext } from "../contexts/MovieContext";
import Moviecard from "../components/MovieCard";

function Favorites() {
  // FIX: Menggunakan 'favorite' (lowercase, singular) sesuai dengan context
  const { favorite } = useMovieContext();

  // Cek jika array tidak kosong
  if (favorite && favorite.length > 0) {
    return (
      <div className="favorites">
        <h2>your favorites</h2>
        <div className="movie-grid">
          {favorite.map((movie) => (
            <Moviecard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-empty">
      <h2>no favorite movies yet</h2>
      <p>start adding movie to your favorite and there will appear here</p>
    </div>
  );
}


export default Favorites;
