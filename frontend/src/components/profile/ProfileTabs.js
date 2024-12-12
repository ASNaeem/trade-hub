import React from "react";
import { Package, ShoppingBag, Heart, MessageCircle } from "lucide-react";

const tabs = [
  { id: "selling", label: "Selling", icon: Package, count: 12 },
  { id: "purchases", label: "Purchases", icon: ShoppingBag, count: 8 },
  { id: "favorites", label: "Favorites", icon: Heart, count: 24 },
  { id: "messages", label: "Messages", icon: MessageCircle, count: 3 },
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Profile sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.label}
            {tab.count && (
              <span
                className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium
                ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
export default ProfileTabs;
