import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Camera } from "lucide-react";
import axios from "axios";
import FormSection from "./FormSection";
import InputField from "./InputField";
import DocumentUpload from "./DocumentUpload";
import { Checkbox } from "@nextui-org/react";
import { motion } from "framer-motion";

const ProfileForm = forwardRef((props, ref) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    isDocumentVerified: false,
    documentType: [],
    documentNumber: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    hasUnsavedChanges: () => hasChanges,
    saveChanges: async () => {
      await handleSaveChanges();
    },
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = {
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          city: response.data.city || "",
          isDocumentVerified: response.data.isDocumentVerified || false,
          documentType: response.data.govtDocument?.documentType
            ? [response.data.govtDocument.documentType.toLowerCase()]
            : [],
          documentNumber: response.data.govtDocument?.documentNumber || "",
        };

        setProfileData(userData);
        setOriginalData(userData);

        if (response.data.profilePicture?.data) {
          setProfileImage(
            `data:${response.data.profilePicture.contentType};base64,${response.data.profilePicture.data}`
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (originalData) {
      const changed =
        JSON.stringify(profileData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [profileData, originalData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newProfileData;

    if (type === "checkbox") {
      newProfileData = {
        ...profileData,
        [name]: checked
          ? [...profileData[name], value]
          : profileData[name].filter((v) => v !== value),
      };
    } else {
      newProfileData = {
        ...profileData,
        [name]: value,
      };
    }

    setProfileData(newProfileData);
    setError("");

    // Explicitly check for changes
    const changed =
      JSON.stringify(newProfileData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        city: profileData.city,
      };

      if (profileData.documentType.length > 0) {
        updateData.govtDocument = {
          documentType: profileData.documentType[0].toUpperCase(),
          documentNumber: profileData.documentNumber,
        };
      }

      await axios.put("http://localhost:5000/api/users/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOriginalData(profileData);
      setHasChanges(false);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result.split(",")[1];

          const token = localStorage.getItem("token");
          await axios.put(
            "http://localhost:5000/api/users/profile",
            {
              profilePicture: {
                data: base64Data,
                contentType: file.type,
              },
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError("Failed to update profile picture");
        console.error("Error uploading profile image:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error loading profile: {error}
      </div>
    );
  }

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
              type="button"
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

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

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
            disabled={true}
            className="bg-gray-100 cursor-not-allowed"
            onChange={() => {}}
          />
          <InputField
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />
          <InputField
            label="Location"
            name="city"
            value={profileData.city}
            onChange={handleChange}
          />

          <div
            className={`flex flex-col justify-center gap-2 ${
              profileData.isDocumentVerified ? "hidden" : ""
            }`}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <label className="block text-sm font-medium text-[var(--primaryColor)]">
                Document Type
              </label>

              <div className="flex pt-2 gap-5">
                <label title="National ID">
                  <Checkbox
                    value="nid"
                    name="documentType"
                    checked={profileData.documentType.includes("nid")}
                    onChange={handleChange}
                  />
                  NID
                </label>
                <label title="Birth Certificate">
                  <Checkbox
                    value="birthCertificate"
                    name="documentType"
                    checked={profileData.documentType.includes(
                      "birthCertificate"
                    )}
                    onChange={handleChange}
                  />
                  Birth Certificate
                </label>
              </div>
            </motion.div>
          </div>

          <div className={`${profileData.isDocumentVerified ? "hidden" : ""}`}>
            <InputField
              label="Identification Number"
              name="documentNumber"
              value={profileData.documentNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={`${profileData.isDocumentVerified ? "hidden" : ""}`}>
          <DocumentUpload />
        </div>
      </div>
    </FormSection>
  );
});

export default ProfileForm;
