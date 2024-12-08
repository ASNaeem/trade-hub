import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/TrendingCarousel.css";

const TrendingCarousel = () => {
  const items = [
    { id: 1, title: "Laptop", price: "$500", image: "/images/laptop.jpg" },
    { id: 2, title: "Sofa", price: "$300", image: "/images/sofa.jpg" },
    // Add more items here
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel">
      <h2>Trending Items</h2>
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id} className="item">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrendingCarousel;
