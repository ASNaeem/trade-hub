import React from "react";
import { Clock, Heart } from "lucide-react";

//#region Fake data
const items = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: 120,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    likes: 24,
    timeLeft: "2 days",
  },
  {
    id: 2,
    title: "Mechanical Keyboard",
    price: 85,
    image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400",
    likes: 15,
    timeLeft: "5 days",
  },
  {
    id: 3,
    title: "Retro Camera",
    price: 150,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
    likes: 32,
    timeLeft: "1 day",
  },
];
//#endregion

const ListedItems = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Listed Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
                <Heart className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-semibold text-gray-900">
                  ${item.price}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {item.timeLeft}
                </div>
              </div>
              <div className="flex items-center mt-1">
                <Heart className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {item.likes} likes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListedItems;
