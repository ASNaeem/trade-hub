import { React, useState } from "react";
import { Settings } from "lucide-react";
import EditProfileModal from "./edit_profile/EditProfileModal";

const UserActions = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <>
      <div className="flex mb-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-[#e9e9e9]"
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};
export default UserActions;
