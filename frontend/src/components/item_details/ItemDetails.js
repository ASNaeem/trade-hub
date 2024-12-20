import React from "react";
import {
  Share2,
  Heart,
  DollarSign,
  Package,
  Calendar,
  FlagIcon,
  MessageCircleCode,
} from "lucide-react";

export default function ItemDetails({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            {item.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${item.title} ${index + 2}`}
                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>

        {/* Item Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-green-600">
                <DollarSign className="inline h-6 w-6" />
                {item.price}
              </span>
              <button className="text-red-500 hover:text-red-600">
                <Heart className="h-6 w-6" />
              </button>
              <button className="text-blue-500 hover:text-blue-600">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {item.condition}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Listed {item.listedDate}
            </span>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>

          <div className="space-y-6">
            <button className="w-full flex items-center justify-center bg-[#1d4e6e] text-white py-3 rounded-lg hover:bg-[#1f4057] transition">
              <MessageCircleCode className="h-5 w-5 mr-2" />
              Contact Seller
            </button>
            <button className="w-full flex items-center justify-center py-3 border border-red-600 rounded-md shadow-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FlagIcon className="h-4 w-4 mr-2" />
              <div>Report Listing</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
