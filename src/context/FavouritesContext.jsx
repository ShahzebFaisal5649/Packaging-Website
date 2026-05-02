/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext();
export const useFavourites = () => useContext(FavouritesContext);

// Stable ID helper — DB products use _id, localStorage products use id
const getStableId = (product) => {
  if (!product) return null;
  if (typeof product === 'string') return product;
  return product._id || product.id || null;
};

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
    const pid = getStableId(product);
    if (!pid) return;
    setFavourites(prev => {
      if (prev.find(p => getStableId(p) === pid)) return prev;
      // Normalise: store _id as id so lookups are consistent
      return [...prev, { ...product, id: pid }];
    });
  };

  const removeFavourite = (id) => {
    setFavourites(prev => prev.filter(p => getStableId(p) !== id));
  };

  // Only match by stable ID — never by name (fixes "all-toggle" bug)
  const isFavourite = (id) => {
    if (!id) return false;
    return favourites.some(p => getStableId(p) === id);
  };

  const toggleFavourite = (product) => {
    const id = getStableId(product);
    if (!id) return false;
    if (isFavourite(id)) {
      removeFavourite(id);
      return false;
    } else {
      addFavourite(product);
      return true;
    }
  };

  const clearFavourites = () => setFavourites([]);

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        addFavourite,
        removeFavourite,
        isFavourite,
        toggleFavourite,
        clearFavourites,
        count: favourites.length,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};
