import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import UserInfo from "../components/profile/UserInfo";
import UserStats from "../components/profile/UserStats";
import UserActions from "../components/profile/UserActions";
import ProfileTabs from "../components/profile/ProfileTabs";

import { initialItem } from "../data/mockdata_itemdetails";

import ListedItems from "../components/profile/tabs/ListedItems";
import FavoritesTab from "../components/profile/tabs/FavTab";
import MessagesTab from "../components/profile/tabs/MessagesTab";

// Mock data - in a real app, this would come from an API
const mockUser = {
  id: "1",
  name: "Sarah Anderson",
  email: "sarah@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  location: "San Francisco, CA",
  isVerified: true,
  rating: 4.9,
  reviewCount: 120,
  joinedDate: "Jan 2023",
};

const mockStats = {
  itemsSold: 245,
  itemsBought: 32,
  totalEarnings: 12450,
  totalSpent: 3200,
  avgRating: 4.9,
  activeListings: 12,
};

function UserProfile() {
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const l = params.get("loggedin");

    if (l) {
      setActiveTab("messages");
    }
  }, [location]);
  const [activeTab, setActiveTab] = useState("selling");

  const renderTabContent = () => {
    switch (activeTab) {
      case "selling":
        return <ListedItems items={initialItem} />;
      case "favorites":
        return <FavoritesTab />;
      case "messages":
        return <MessagesTab />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="bg-gradient-to-r from-[var(--primaryColor)] to-[var(--secondaryColor)] pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserInfo user={mockUser} />
          <div className="mt-6">
            <UserActions />
          </div>
        </div>
      </div>

      <div className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <UserStats stats={mockStats} />
            <div className="mt-8">
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="mt-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
