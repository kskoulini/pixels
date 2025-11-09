// src/context/ItemsContext.js
import React from 'react';
import { getItemsCache, refreshItems, bootstrapCommentsFromStatic } from '../utils/storage';

const ItemsCtx = React.createContext(null);

export function ItemsProvider({ categoriesForComments, children }) {
  const [data, setData] = React.useState(() => getItemsCache()); // {categories, items}

  // optional: hydrate once on mount (if cache is empty)
  React.useEffect(() => {
    if (!data.items?.length) {
      refreshItems().then(setData);
    }
  }, []); // eslint-disable-line

  const refreshAll = React.useCallback(async () => {
    // 1) items
    const latest = await refreshItems(true);
    setData(latest);
    // 2) comments (pass only categories that have comment files; typically exclude 'all')
    await bootstrapCommentsFromStatic(categoriesForComments, true);
  }, [categoriesForComments]);

  return (
    <ItemsCtx.Provider value={{ data, setData, refreshAll }}>
      {children}
    </ItemsCtx.Provider>
  );
}

export function useItems() {
  const ctx = React.useContext(ItemsCtx);
  if (!ctx) throw new Error('useItems must be used within <ItemsProvider>');
  return ctx;
}
