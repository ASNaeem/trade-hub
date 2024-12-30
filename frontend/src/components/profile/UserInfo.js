import React from "react";
import { MapPin, Calendar } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

const UserInfo = ({ user }) => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="sm:flex sm:space-x-5">
        <div className="flex-shrink-0">
          <img
            className="mx-auto h-20 w-20 object-cover rounded-full"
            src={user.profilePicture}
            alt={user.name}
          />
        </div>
        <div className="mt-4 text-center sm:mt-0 sm:text-left">
          <div className="flex items-center">
            <p className="text-xl font-bold  text-white sm:text-2xl">
              {user.name}
            </p>
            <VerificationBadge isVerified={user.isVerified} className="ml-2" />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm  text-white">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Member since {user.joinedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
