import React, { useState } from "react";
import { Camera } from "lucide-react";
import FormSection from "./FormSection";
import InputField from "./InputField";
import DocumentUpload from "./DocumentUpload";
import { Checkbox } from "@nextui-org/react";

export default function ProfileForm() {
  const [profileData, setProfileData] = useState({
    name: "Sarah Anderson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    isVerified: false,
    documentType: [],
  });

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProfileData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((v) => v !== value),
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormSection title="Basic Information">
      <div className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profileImageInput"
              onChange={handleImageChange}
            />
            <button
              className="absolute bottom-0 right-0 p-1.5 bg-[var(--buttonColor)] rounded-full text-white hover:bg-[var(--buttonHoverColor)]"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Profile Photo</h3>
            <p className="text-sm text-gray-500">JPG or PNG</p>
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

          <div
            className={`flex flex-col justify-center gap-2 ${
              profileData.isVerified ? "hidden" : ""
            }`}
          >
            <label className="block text-sm font-medium text-[var(--primaryColor)]">
              Document Type
            </label>
            <div className="flex gap-5">
              <Checkbox
                value={"nid"}
                name="documentType"
                checked={profileData.documentType.includes("nid")}
                onChange={handleChange}
              >
                NID
              </Checkbox>

              <Checkbox
                value={"birthCertificate"}
                name="documentType"
                checked={profileData.documentType.includes("birthCertificate")}
                onChange={handleChange}
              >
                Birth Certificate
              </Checkbox>
            </div>
          </div>

          <div className={`${profileData.isVerified ? "hidden" : ""}`}>
            <InputField
              label="Identification Number"
              name="documentNumber"
              value={profileData.documentNumber || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={`${profileData.isVerified ? "hidden" : ""}`}>
          <DocumentUpload />
        </div>
      </div>
    </FormSection>
  );
}
