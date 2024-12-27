import { React } from "react";
import { Settings, LogOut, Globe } from "lucide-react";
import EditProfileModal from "./edit_profile/EditProfileModal";

const UserActions = ({ isEditModalOpen, setIsEditModalOpen }) => {
  return (
    <>
      <div className="flex gap-4 justify-end mb-4">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="group relative p-3 rounded-xl bg-white border border-gray-200 
            text-gray-700 hover:text-blue-600 hover:scale-105 hover:border-blue-200 hover:bg-blue-50 
            transition-all duration-200 ease-out active:scale-95"
        >
          <Settings className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-200" />
          <span
            className="absolute -bottom-8 right-0 px-2.5 py-1 rounded-md bg-gray-900
            text-white text-xs font-medium scale-0 group-hover:scale-100 transition-transform duration-150"
          >
            Settings
          </span>
        </button>

        <button
          onClick={() => (window.location.href = "/browse")}
          className="group relative p-3 rounded-xl bg-white border border-gray-200 
            text-gray-700 hover:text-purple-600 hover:scale-105 hover:border-purple-200 hover:bg-purple-50 
            transition-all duration-200 ease-out active:scale-95"
        >
          <Globe
            className="h-5 w-5 transform transition-transform duration-200 
            group-hover:rotate-45"
          />
          <span
            className="absolute -bottom-8 right-0 px-2.5 py-1 rounded-md bg-gray-900
            text-white text-xs font-medium scale-0 group-hover:scale-100 transition-transform duration-150"
          >
            Browse
          </span>
        </button>

        <button
          onClick={function logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("loggedin");
            window.location.href = "/";
          }}
          className="group relative p-3 rounded-xl bg-white border border-gray-200 
            text-gray-700 hover:text-red-600 hover:scale-105 hover:border-red-200 hover:bg-red-50 
            transition-all duration-200 ease-out active:scale-95"
        >
          <LogOut
            className="h-5 w-5 transform transition-transform duration-200 
            group-hover:-translate-x-0.5"
          />
          <span
            className="absolute -bottom-8 right-0 px-2.5 py-1 rounded-md bg-gray-900
            text-white text-xs font-medium scale-0 group-hover:scale-100 transition-transform duration-150"
          >
            Logout
          </span>
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
