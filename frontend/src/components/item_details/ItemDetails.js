import React, { useState } from "react";
import {
  Share2,
  Heart,
  DollarSign,
  Package,
  Calendar,
  FlagIcon,
  MessageCircleCode,
} from "lucide-react";
import AlertDialog from "../AlertDialog";

export default function ItemDetails({ item }) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleReport = () => {
    // Handle report submission logic here
    setIsReportDialogOpen(false);
  };

  const handleFavorite = () => {
    // Handle favorite toggle logic here
  };

  return (
    <>
      <div className="bg-[var(--cardBgColor)] rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-[400px] object-cover rounded-lg border border-gray-100"
            />
            <div className="grid grid-cols-4 gap-2">
              {item.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 border border-gray-100 transition-all duration-200"
                />
              ))}
            </div>
          </div>

          {/* Item Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[var(--textColorPrimary)]">
                {item.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-[var(--iconColor)]">
                  <DollarSign className="inline h-6 w-6" />
                  {item.price}
                </span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Heart className="h-6 w-6 text-[var(--errorColor)]" />
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
                Listed {item.listedDate}
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

            <div className="space-y-4">
              <button className="w-full flex items-center justify-center bg-[var(--buttonColor)] text-white py-3 rounded-lg hover:bg-[var(--buttonHoverColor)] transition-colors duration-200 shadow-sm">
                <MessageCircleCode className="h-5 w-5 mr-2" />
                Contact Seller
              </button>
              <button
                className="w-full flex items-center justify-center py-3 border border-[var(--errorColor)] rounded-lg shadow-sm font-medium text-[var(--errorColor)] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                onClick={() => setIsReportDialogOpen(true)}
              >
                <FlagIcon className="h-4 w-4 mr-2" />
                Report Listing
              </button>
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
