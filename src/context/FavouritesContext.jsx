/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext();
export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('packagingFavourites')) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('packagingFavourites', JSON.stringify(favourites));
  }, [favourites]);

  const addFavourite = (product) => {
    setFavourites(prev => {
      if (prev.find(p => p.id === product.id || p.name === product.name)) return prev;
      return [...prev, product];
    });
  };

  const removeFavourite = (id) => {
    setFavourites(prev => prev.filter(p => p.id !== id && p.name !== id));
  };

  const isFavourite = (id) => favourites.some(p => p.id === id || p.name === id);

  const toggleFavourite = (product) => {
    const id = product?.id || product?.name || product;
    const productObj = typeof product === 'object' ? product : { id, name: id };
    if (isFavourite(id)) {
      removeFavourite(id);
      return false;
    } else {
      addFavourite(productObj);
      return true;
    }
  };

  const clearFavourites = () => setFavourites([]);

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite, toggleFavourite, clearFavourites, count: favourites.length }}>
      {children}
    </FavouritesContext.Provider>
  );
};
