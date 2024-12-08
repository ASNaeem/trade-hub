import React from "react";
import "../styles/CityDeals.css";

const CityDeals = () => {
  const items = [
    { id: 1, title: "Dining Table", price: "$200", image: "/images/table.jpg" },
    { id: 2, title: "Smartphone", price: "$400", image: "/images/phone.jpg" },
    // Add more items here
  ];

  return (
    <section className="city-deals">
      <h2>Top Deals in Your City</h2>
      <div className="deals-grid">
        {items.map((item) => (
          <div key={item.id} className="deal-item">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityDeals;
