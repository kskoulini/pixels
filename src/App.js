import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from 'components/Landing';
import Readme from 'components/Readme';
import Chat from 'components/Chat';
import { bootstrapCommentsFromStatic } from 'utils/storage';
import { CATEGORIES } from 'data';


import './App.css';

function App() {

  useEffect(() => {
    // Use the categories that actually have JSON files in /public/data/comments
    const idsForFiles = CATEGORIES.map(c => c.id).filter(id => id !== 'all');
    bootstrapCommentsFromStatic(idsForFiles, true);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/readme" element={<Readme />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
