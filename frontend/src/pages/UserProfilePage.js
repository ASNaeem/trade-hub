import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import UserInfo from "../components/profile/UserInfo";
import UserStats from "../components/profile/UserStats";
import UserActions from "../components/profile/UserActions";
import ProfileTabs from "../components/profile/ProfileTabs";
import { initialItem } from "../data/mockdata_itemdetails";
import ListedItems from "../components/profile/tabs/ListedItems";
import FavoritesTab from "../components/profile/tabs/FavTab";
import MessagesTab from "../components/profile/tabs/MessagesTab";

// Keep mock stats since we don't have this data yet
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
  const [activeTab, setActiveTab] = useState("selling");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/auth";
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Combine real user data with mock fields we don't have yet
        const userData = {
          ...response.data,
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
          location: response.data.city || "Location not set",
          isVerified: response.data.isDocumentVerified,
          rating: 4.9,
          reviewCount: 120,
          joinedDate: new Date(response.data.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          ),
        };

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          window.location.href = "/auth";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const l = params.get("loggedin");
    if (l) {
      setActiveTab("messages");
    }
  }, [location]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">
          Please log in to view your profile
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--primaryColor)] to-[var(--secondaryColor)] pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserInfo user={user} />
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
    </div>
  );
}

export default UserProfile;
