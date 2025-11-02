import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from 'components/Landing';
import Readme from 'components/Readme';
import Chat from 'components/Chat';

import './App.css';

function App() {
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
