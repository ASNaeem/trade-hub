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
import { useNavigate } from "react-router-dom";
import UserService from "../../services/userService";
import axios from "axios";
export default function ItemDetails({ item }) {
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
          "http://localhost:5000/api/users/my-favourites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsFavorite(response.data.includes(item._id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }

    getFavorites();
  }, [item._id]);

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (!item?.sellerId) {
        setLoading(false);
        setError("No seller information available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const sellerData = await UserService.getUserById(item.sellerId);
        if (!sellerData) {
          throw new Error("Seller not found");
        }
        setSeller(sellerData);
      } catch (error) {
        console.error("Failed to fetch seller details:", error);
        setError("Failed to load seller information");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [item?.sellerId]); // Only re-run if sellerId changes

  const handleReport = () => {
    // Handle report submission logic here
    setIsReportDialogOpen(false);
  };

  // Helper function to get image source
  const getImageSrc = (image) => {
    if (!image) return "";

    console.log("Processing image in ItemDetails:", {
      type: image.type,
      hasData: !!image.data,
      hasUrl: !!image.url,
      contentType: image.contentType,
      dataPreview: image.data?.substring(0, 100) + "...",
    });

    if (image.type === "base64" && image.data) {
      // If the data is already a complete data URL, return it
      if (image.data.startsWith("data:")) {
        return image.data;
      }
      // Otherwise, construct the data URL
      return `data:${image.contentType};base64,${image.data}`;
    }

    return image.url || "";
  };

  const handleContactSeller = () => {
    if (item?.sellerId) {
      navigate(`/inbox?userId=${item.sellerId}`);
    }
  };

  const ToggleFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      if (isFavorite) {
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
        console.log("Removed from favorites:", response.data);
        setIsFavorite(false);
      } else {
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
        console.log("Added to favorites:", response.data);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Add error handling UI if needed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--buttonColor)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Item not found
      </div>
    );
  }

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
                  onClick={ToggleFavorites}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isFavorite ? "text-red-600" : "hover:bg-gray-100"
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
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
            {seller && (
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
                          {seller.name ? seller.name[0].toUpperCase() : "?"}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-[var(--textColorPrimary)]">
                          {seller.name || "Unknown Seller"}
                        </h2>
                        {seller.isVerified && (
                          <div className="flex items-center pt-1 space-x-2">
                            <Shield className="h-4 w-4 text-[var(--buttonColor)]" />
                            <span className="text-[var(--buttonColor)]">
                              Verified Seller
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[var(--iconColor)]" />
                      <span className="text-[var(--textColorSecondary)]">
                        Member since{" "}
                        {new Date(seller.createdAt).toLocaleDateString()}
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
            )}
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
