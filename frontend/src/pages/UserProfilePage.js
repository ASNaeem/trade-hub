import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Package, Heart, MessageCircle } from "lucide-react";

import UserInfo from "../components/profile/UserInfo";
import UserStats from "../components/profile/UserStats";
import UserActions from "../components/profile/UserActions";
import ProfileTabs from "../components/profile/ProfileTabs";
import { initialItem } from "../data/mockdata_itemdetails";
import ListedItems from "../components/profile/tabs/ListedItems";
import FavoritesTab from "../components/profile/tabs/FavTab";
import MessagesTab from "../components/profile/tabs/MessagesTab";
import Header from "../components/Header";
import useMessages from "../hooks/useMessages";
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
  const [Tabs, setTabs] = useState([
    { id: "selling", label: "Selling", icon: Package, count: " 0" },
    { id: "favorites", label: "Favorites", icon: Heart, count: 12 },
    { id: "messages", label: "Messages", icon: MessageCircle, count: " 0" },
  ]);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState("selling");
  const [user, setUser] = useState(null);
  const [isloading, setisloading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { messages, loading, error } = useMessages();
  const [inbox, setInbox] = useState([]);

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
          location: response.data.city || "Location not set",
          isVerified: response.data.isDocumentVerified,
          profilePicture:
            response.data.profilePicture != "null"
              ? response.data.profilePicture
              : "https://files.catbox.moe/aq0wd6.jpg",
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
        setTabs(
          Tabs.map((tab) =>
            tab.id === "favorites"
              ? {
                  ...tab,
                  count:
                    response.data.favourites.length == 0
                      ? " 0"
                      : response.data.favourites.length,
                }
              : tab
          )
        );

        // Find all messages for each unique sender
        const uniqueSenderIds = [
          ...new Set(
            messages.map((msg) =>
              msg.senderId === response.data.id ? msg.receiverId : msg.senderId
            )
          ),
        ];

        const new_inbox_state = [];

        for (const partnerId of uniqueSenderIds) {
          if (partnerId) {
            try {
              const partnerResponse = await axios.get(
                `http://localhost:5000/api/users/${partnerId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Get all messages between current user and this partner
              const conversationMessages = messages.filter(
                (msg) =>
                  (msg.senderId === partnerId &&
                    msg.receiverId === response.data.id) ||
                  (msg.senderId === response.data.id &&
                    msg.receiverId === partnerId)
              );

              // Sort messages by date and get the latest one
              const sortedMessages = conversationMessages.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );

              if (sortedMessages.length > 0) {
                new_inbox_state.push({
                  id: partnerResponse.data.id,
                  name: partnerResponse.data.name,
                  profilePicture:
                    partnerResponse.data.profilePicture ||
                    "https://files.catbox.moe/k4ao9t.png",
                  lastMessage: sortedMessages[0],
                });
              }
            } catch (error) {
              console.error(`Error fetching user ${partnerId}:`, error);
            }
          }
        }

        setInbox(new_inbox_state);
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === "messages"
              ? {
                  ...tab,
                  count: new_inbox_state.length || "0",
                }
              : tab
          )
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await axios
          .get("http://localhost:5000/api/items", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const myItems = res.data.items.filter(
              (item) => item.sellerId === response.data.id
            );
            setTabs(
              Tabs.map((tab) =>
                tab.id === "selling"
                  ? {
                      ...tab,
                      count:
                        myItems.length == 0 ? " 0" : myItems.length.toString(),
                    }
                  : tab
              )
            );
            console.log(Tabs);
          });
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          window.location.href = "/auth";
        }
      } finally {
        setisloading(false);
      }
    };

    fetchUserData();
  }, [loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const l = params.get("loggedin");
    const s = params.get("settings");
    if (s) {
      setIsEditModalOpen(true);
    }
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
        return <MessagesTab inbox={inbox} />;
      default:
        return null;
    }
  };

  if (isloading) {
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
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Header
        shadow={true}
        className="text-[var(--foreGroundColor)] !fixed bg-transparent overflow-hidden fill-[var(--foreGroundColor)]"
      />{" "}
      <div className="bg-gradient-to-r from-[var(--primaryColor)] to-[var(--secondaryColor)] pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserInfo user={user} />
          <div className="mt-6">
            <UserActions
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <UserStats stats={mockStats} />
            <div className="mt-8">
              <ProfileTabs
                tabs={Tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
            <div className="mt-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
