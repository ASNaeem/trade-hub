import React from "react";
import { Star, MessageCircle, Shield, Calendar } from "lucide-react";

export default function SellerInfo({ seller }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">
              {seller.name[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{seller.name}</h2>
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < seller.rating ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600 text-sm">
                ({seller.totalSales} sales)
              </span>
            </div>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <MessageCircle className="h-5 w-5" />
          <span>Message</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Member since {seller.memberSince}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Verified Seller</span>
        </div>
      </div>
    </div>
  );
}
