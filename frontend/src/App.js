import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CityDeals from './components/CityDeals';
import Footer from './components/Footer';
import Registration from './components/Registration'; // Import Registration form
import TrendingCarousel from './components/TrendingCarousel'; // Import the Carousel

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header /> {/* The header/navigation section */}

        <Routes>  {/* Use Routes here instead of Switch */}
          {/* Home Route */}
          <Route path="/" element={
            <>
              <HeroSection /> {/* The hero section */}
              <TrendingCarousel /> {/* The carousel */}
              <CityDeals /> {/* City-specific deals */}
            </>
          } />

          {/* Registration Route */}
          <Route path="/register" element={<Registration />} /> {/* The registration form */}
        </Routes>

        <Footer /> {/* Footer with important information */}
      </div>
    </Router>
  );
};

export default App;
