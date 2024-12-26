import React from "react";
import { Heart, ExternalLink } from "lucide-react";

//#region Fake Data

const favorites = [
  {
    id: 1,
    title: "Vintage Camera",
    price: 299,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    seller: "Retro Collectibles",
    likes: 45,
  },
  {
    id: 2,
    title: "Designer Watch",
    price: 199,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    seller: "Luxury Timepieces",
    likes: 32,
  },
  {
    id: 2,
    title: "Designer Watch",
    price: 199,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    seller: "Luxury Timepieces",
    likes: 32,
  },
  {
    id: 2,
    title: "Designer Watch",
    price: 199,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    seller: "Luxury Timepieces",
    likes: 32,
  },
];
//#endregion

const FavTab = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((item) => (
        <div key={item.id} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition"
            />
            <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm">
              <Heart className="h-4 w-4 text-teal-600" fill="currentColor" />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.seller}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                ${item.price}
              </p>
              <a
                href="/item"
                className="text-sm text-[var(--linkTextColor)] hover:text-[var(--linkTextHoverColor)] flex items-center"
              >
                View <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Heart className="h-4 w-4 text-red-500 mr-1" />
              {item.likes} others like this
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavTab;
