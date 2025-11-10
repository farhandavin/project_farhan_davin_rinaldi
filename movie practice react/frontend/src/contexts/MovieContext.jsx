import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  // FIX 1: Menggunakan [] untuk useState
  const [favorite, setFavorite] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) {
      setFavorite(JSON.parse(storedFavs));
    }
  }, []);

  // FIX 2: Save favorites to localStorage whenever 'favorite' state changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorite));
  }, [favorite]);

  const addFavorites = (movie) => {
    setFavorite((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (movieId) => {
    setFavorite((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorite.some((movie) => movie.id === movieId);
  };

  const value = {
    favorite,
    addFavorites, // Pastikan nama ini konsisten
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};