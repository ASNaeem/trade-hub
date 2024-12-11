import React from 'react';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    title: "iPhone 13 Pro Max - 256GB",
    price: "$899",
    location: "Downtown Area",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Samsung Galaxy S21 Ultra",
    price: "$699",
    location: "West End",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=400&q=80",
    date: "1 day ago"
  },
  {
    id: 3,
    title: "Google Pixel 6 Pro",
    price: "$599",
    location: "East Side",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80",
    date: "3 hours ago"
  },
  {
    id: 4,
    title: "OnePlus 9 Pro",
    price: "$549",
    location: "North Area",
    condition: "Brand New",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=400&q=80",
    date: "Just now"
  },
  {
    id: 5,
    title: "iPhone 12 - 128GB",
    price: "$649",
    location: "South District",
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80",
    date: "5 hours ago"
  },
  {
    id: 6,
    title: "Xiaomi Mi 11",
    price: "$399",
    location: "Central Area",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=400&q=80",
    date: "1 week ago"
  }
];

const ProductGrid =()=> {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;