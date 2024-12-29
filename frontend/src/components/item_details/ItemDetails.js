import React, { useState, useEffect } from "react";
import {
  Heart,
  DollarSign,
  Package,
  Calendar,
  FlagIcon,
  MessageCircleCode,
  Shield,
} from "lucide-react";
import AlertDialog from "../AlertDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ItemDetails({ item, seller }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function getFavorites() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/auth";
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/favourites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(response.data.includes(item._id));
      } catch (e) {}
    }

    getFavorites();
  }, [isFavorite]);

  const navigate = useNavigate();

  const handleReport = () => {
    // Handle report submission logic here
    setIsReportDialogOpen(false);
  };

  // Helper function to get image source
  const getImageSrc = (imageObj) => {
    if (!imageObj) return "";
    if (imageObj.type === "url") return imageObj.url;
    if (imageObj.type === "buffer" && imageObj.data) {
      return `data:${imageObj.contentType};base64,${imageObj.data}`;
    }
    return "";
  };

  const handleContactSeller = () => {
    navigate(`/inbox?userId=${item.sellerId}`);
  };

  const ToggleFavorites = async () => {
    try {
      if (isFavorite) {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/auth";
          return;
        }

        const response = await axios.delete(
          "http://localhost:5000/api/users/delete-favorite",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              itemId: item._id,
            },
          }
        );

        setIsFavorite(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/add-favorite",
        {
          itemId: item._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFavorite(true);
    } catch (e) {}
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <img
            src={getImageSrc(item.images[selectedImageIndex])}
            alt={item.title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg border border-gray-100"
          />
          <div className="grid grid-cols-5 gap-2">
            {item.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative rounded-lg overflow-hidden ${
                  selectedImageIndex === index
                    ? "ring-2 ring-[var(--buttonColor)] ring-offset-2"
                    : "hover:opacity-80"
                }`}
              >
                <img
                  src={getImageSrc(image)}
                  alt={`${item.title} ${index + 1}`}
                  className="w-full h-20 object-cover cursor-pointer transition-all duration-200"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Item Info */}
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--textColorPrimary)]">
                {item.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-xl md:text-2xl font-bold text-[var(--iconColor)]">
                  <DollarSign className="inline h-6 w-6" />
                  {item.price}
                </span>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  onClick={ToggleFavorites}
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isFavorite ? "fill-[var(--errorColor)]" : ""
                    } text-[var(--errorColor)]`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-[var(--textColorSecondary)]">
              <span className="flex items-center bg-[var(--pricingColor)] px-3 py-1 rounded-full">
                <Package className="h-4 w-4 mr-1 text-[var(--iconColor)]" />
                {item.condition}
              </span>
              <span className="flex items-center bg-[var(--pricingColor)] px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 mr-1 text-[var(--iconColor)]" />
                Listed {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="border-t border-b border-gray-100 py-4">
              <h2 className="text-lg font-semibold mb-2 text-[var(--textColorPrimary)]">
                Description
              </h2>
              <p className="text-[var(--textColorSecondary)]">
                {item.description}
              </p>
            </div>

            {/* Seller Info and Action Buttons Section */}
            <div className="py-4">
              <div className="flex justify-between items-start">
                {/* Seller Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[var(--textColorPrimary)]">
                    Seller Information
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[var(--buttonColor)] text-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {seller.name[0]}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--textColorPrimary)]">
                        {seller.name}
                      </h2>
                      <div className="flex items-center pt-1 space-x-2">
                        <Shield className="h-4 w-4 text-[var(--buttonColor)]" />
                        <span className="text-[var(--buttonColor)]">
                          Verified Seller
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[var(--iconColor)]" />
                    <span className="text-[var(--textColorSecondary)]">
                      Member since {seller.memberSince}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 min-w-[200px]">
                  <button
                    onClick={handleContactSeller}
                    className="w-full flex items-center justify-center bg-[var(--buttonColor)] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                  >
                    <MessageCircleCode className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                  <button
                    className="w-full flex items-center justify-center px-6 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm font-medium text-sm text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200"
                    onClick={() => setIsReportDialogOpen(true)}
                  >
                    <FlagIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Report Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Dialogs */}
      <AlertDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onConfirm={handleReport}
        title="Report Listing"
        message="Are you sure you want to report this listing? This action cannot be undone."
        type="danger"
      />
    </>
  );
}
