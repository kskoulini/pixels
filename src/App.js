import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from 'components/Landing';
import Readme from 'components/Readme';
import Chat from 'components/Chat';
import { bootstrapCommentsFromStatic } from 'utils/storage';
import { CATEGORIES } from 'data';
import { ItemsProvider } from 'context/ItemsContext';


import './App.css';

function App() {

  const commentCats = CATEGORIES.map(c => c.id).filter(id => id !== 'all');

  useEffect(() => {
    // Use the categories that actually have JSON files in /public/data/comments
    const idsForFiles = CATEGORIES.map(c => c.id).filter(id => id !== 'all');
    bootstrapCommentsFromStatic(idsForFiles, true);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      // re-run your bootstrap or targeted re-fetch
      bootstrapCommentsFromStatic(CATEGORIES.map(c => c.id).filter(id => id !== 'all'), true);
    };
    window.addEventListener('visibilitychange', onFocus, false);
    window.addEventListener('focus', onFocus, false);
    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <ItemsProvider categoriesForComments={commentCats}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/readme" element={<Readme />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </ItemsProvider>
  );
}

export default App;
