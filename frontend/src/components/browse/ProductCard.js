import React from "react";
import { MapPin, Heart } from "lucide-react";

const ProductCard = ({
  image,
  title,
  price,
  location,
  condition,
  date,
  item_click,
}) => {
  return (
    <div
      onClick={item_click}
      className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-xl font-bold text-indigo-600 mb-2">{price}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{condition}</span>
          <span className="text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
