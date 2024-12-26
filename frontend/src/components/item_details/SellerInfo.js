import React from "react";
import { Star, Shield, Calendar } from "lucide-react";

export default function SellerInfo({ seller }) {
  return (
    <div className="bg-[var(--cardBgColor)] rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[var(--buttonColor)] text-white rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">{seller.name[0]}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--textColorPrimary)]">
              {seller.name}
            </h2>
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < seller.rating ? "fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-[var(--textColorSecondary)] text-sm">
                ({seller.totalSales} sales)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2 bg-[var(--pricingColor)] px-3 py-2 rounded-lg">
          <Calendar className="h-4 w-4 text-[var(--iconColor)]" />
          <span className="text-[var(--textColorSecondary)]">
            Member since {seller.memberSince}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-[var(--pricingColor)] px-3 py-2 rounded-lg">
          <Shield className="h-4 w-4 text-[var(--buttonColor)]" />
          <span className="text-[var(--buttonColor)]">Verified Seller</span>
        </div>
      </div>
    </div>
  );
}
