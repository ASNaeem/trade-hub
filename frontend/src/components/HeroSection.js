import React from "react";
import "../styles/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Find Great Deals on Secondhand Items</h1>
        <input type="text" placeholder="Search for items..." className="search-bar" />
      </div>
      <div className="categories">
        <button>Electronics</button>
        <button>Furniture</button>
        <button>Fashion</button>
        <button>More Categories</button>
      </div>
    </section>
  );
};

export default HeroSection;
