// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Summaries from './pages/Summaries';
import ManageFeeds from './pages/ManageFeeds'; // Import the new component
import NewsBroadcast from './pages/NewsBroadcast'; // Import the NewsBroadcast component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="summaries" element={<Summaries />} />
        <Route path="manage-feeds" element={<ManageFeeds />} />
        <Route path="news-broadcast" element={<NewsBroadcast />} /> {/* Add the broadcast route */}
      </Route>
    </Routes>
  );
}

export default App;
