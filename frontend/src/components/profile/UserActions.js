import { React, useState } from "react";
import { Settings, LogOut, Globe } from "lucide-react";
import EditProfileModal from "./edit_profile/EditProfileModal";

const UserActions = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  return (
    <>
      <div className="flex gap-4 justify-end mb-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-[#e9e9e9]"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          onClick={() => (window.location.href = "/browse")}
          className="px-4 py-2 border text-gray-700 rounded-md bg-white hover:bg-[#e9e9e9]"
        >
          <Globe className="h-4 w-4" />
        </button>

        <button
          onClick={function logout() {
            localStorage.removeItem("loggedin");
            window.location.href = "/";
          }}
          className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-[#e9e9e9]"
        >
          <LogOut className="h-4 w-4" />
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
