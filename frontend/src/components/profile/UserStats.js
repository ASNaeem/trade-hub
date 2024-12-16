import React from "react";
import { Package, ShoppingBag, DollarSign, Star } from "lucide-react";

const UserStats = ({ stats }) => {
  const statItems = [
    { label: "Items Sold", value: stats.itemsSold, icon: Package },
    { label: "Items Bought", value: stats.itemsBought, icon: ShoppingBag },
    {
      label: "Total Earnings",
      value: `$${stats.totalEarnings}`,
      icon: DollarSign,
    },
    { label: "Avg Rating", value: stats.avgRating.toFixed(1), icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="h-5 w-5 text-[#2C2C2C]}" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;
