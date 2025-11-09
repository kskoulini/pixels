// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from 'components/Landing';
import Readme from 'components/Readme';
import Chat from 'components/Chat';
import { bootstrapCommentsFromStatic } from 'utils/storage';
import { ItemsProvider, useItems } from 'context/ItemsContext'; // ← useItems here

import './App.css';

// Runs effects that need categories from ItemsContext
function CommentsBootstrapper() {
  const { data } = useItems();                   // { categories, items }
  const cats = (data?.categories || []).map(c => c.id).filter(id => id !== 'all');

  // initial bootstrap when categories are available
  useEffect(() => {
    if (cats.length) {
      bootstrapCommentsFromStatic(cats, true);
    }
    // re-run if category list changes
  }, [cats.join(',')]);

  // refresh on focus / visibility change
  useEffect(() => {
    if (!cats.length) return;
    const onFocus = () => bootstrapCommentsFromStatic(cats, true);
    window.addEventListener('visibilitychange', onFocus, false);
    window.addEventListener('focus', onFocus, false);
    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, [cats.join(',')]);

  return null; // no UI
}

function App() {
  return (
    <ItemsProvider /* categoriesForComments prop no longer needed */>
      {/* Bootstrapper needs to live inside the provider */}
      <CommentsBootstrapper />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/readme" element={<Readme />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </ItemsProvider>
  );
}

export default App;
