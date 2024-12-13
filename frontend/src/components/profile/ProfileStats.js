import React from "react";
import { Package, DollarSign, Star } from "lucide-react";

export default function ProfileStats() {
  const stats = [
    { label: "Items Sold", value: "245", icon: Package },
    { label: "Total Earnings", value: "$12,450", icon: DollarSign },
    { label: "Avg Rating", value: "4.9", icon: Star },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center shadow-xl">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
