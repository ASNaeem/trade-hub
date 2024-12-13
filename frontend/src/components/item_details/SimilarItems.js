import React from "react";
import { DollarSign } from "lucide-react";

export default function SimilarItems({ items }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="aspect-square mb-2 overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <h3 className="font-semibold text-gray-900 truncate">
              {item.title}
            </h3>
            <p className="text-green-600 font-bold flex items-center">
              <DollarSign className="h-4 w-4" />
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
