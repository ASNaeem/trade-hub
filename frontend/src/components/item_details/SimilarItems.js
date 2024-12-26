import React from "react";
import { DollarSign } from "lucide-react";

export default function SimilarItems({ items }) {
  return (
    <div className="bg-[var(--cardBgColor)] rounded-lg shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-[var(--textColorPrimary)]">
        Similar Items
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => {
              window.location.href = `/item?item=${item.title}`;
            }}
          >
            <div className="aspect-square mb-2 overflow-hidden rounded-lg border border-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <h3 className="font-semibold text-[var(--textColorPrimary)] truncate">
              {item.title}
            </h3>
            <p className="text-[var(--buttonColor)] font-bold flex items-center">
              <DollarSign className="h-4 w-4" />
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
