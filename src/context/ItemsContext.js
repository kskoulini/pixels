// src/context/ItemsContext.js
import React from 'react';
import {
    getItemsCache,
    refreshItems,
    bootstrapCommentsFromStatic,
    KEY_COMMENTS,
    KEY_COMMENTS_BOOTSTRAP
} from '../utils/storage';

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
        // 1) items (unchanged)
        const latest = await refreshItems(true);
        setData(latest);

        // 2) comments: clear and repopulate from GitHub
        localStorage.removeItem(KEY_COMMENTS);
        localStorage.removeItem(KEY_COMMENTS_BOOTSTRAP);

        await bootstrapCommentsFromStatic(
            categoriesForComments,
        /* force     */ true,
        /* replace   */ true,
        /* allowEmpty*/ true,
        /* debug     */ 'refreshAll hard replace'
        );

        window.dispatchEvent(new Event('pixels:comments-updated'));
        return latest;
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
