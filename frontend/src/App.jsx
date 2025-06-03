// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Summaries from './pages/Summaries';
import ManageFeeds from './pages/ManageFeeds';
import NewsBroadcast from './pages/NewsBroadcast';

// Apply global styles to fix navigation bullets
import './global-styles.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to summaries */}
        <Route index element={<Navigate to="/summaries" replace />} />
        <Route path="summaries" element={<Summaries />} />
        <Route path="manage-feeds" element={<ManageFeeds />} />
        <Route path="news-broadcast" element={<NewsBroadcast />} />
      </Route>
    </Routes>
  );
}

export default App;
