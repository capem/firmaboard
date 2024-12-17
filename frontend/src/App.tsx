import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import Onboarding from './components/onboarding/Onboarding';
import Home from './components/home/Home';
// ... other imports

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* ... other routes */}
    </Routes>
  );
};

export default App;
