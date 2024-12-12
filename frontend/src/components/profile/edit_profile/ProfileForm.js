import React, { useState } from "react";
import { Camera } from "lucide-react";
import FormSection from "./FormSection";
import InputField from "./InputField";

export default function ProfileForm() {
  const [profileData, setProfileData] = useState({
    name: "Sarah Anderson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate about vintage fashion and sustainable shopping.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <FormSection title="Basic Information">
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Profile Photo</h3>
            <p className="text-sm text-gray-500">
              JPG or PNG. Max size of 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InputField
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
          />
          <InputField
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />
          <InputField
            label="Location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </FormSection>
  );
}
