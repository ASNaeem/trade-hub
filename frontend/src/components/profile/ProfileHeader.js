import React from "react";
import { MapPin, Star, Settings } from "lucide-react";

//#region fake data
const demoUser = {
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  name: "Sarah Anderson",
  location: "San Francisco, CA",
  rating: 4.9,
  reviews: 120,
};

// Example usage
// <ProfileHeader user={demoUser} />

//#endregion

const ProfileHeader = ({ user }) => {
  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-24 sm:-mt-32 sm:flex sm:items-end sm:space-x-5">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {user.name}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{user.location}</span>
                <div className="flex items-center ml-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>
                    {user.rating} ({user.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Settings className="h-5 w-5 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
