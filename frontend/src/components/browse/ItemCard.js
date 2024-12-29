import React from "react";
import { Tag, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ItemCard = ({
  id,
  title,
  price,
  brand,
  condition,
  location,
  imageUrl,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
      onClick={() => {
        navigate(`/item?id=${id}`);
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Tag size={16} />
          <span>{brand}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="mt-3">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              condition === "New"
                ? "bg-green-100 text-green-800"
                : condition === "Used"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {condition}
          </span>
        </div>
      </div>
    </div>
  );
};
