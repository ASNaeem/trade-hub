import React from "react";
import { Tag, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getImageSrc = (image) => {
  if (!image) {
    console.log("No image provided");
    return "/placeholder-image.jpg";
  }

  try {
    console.log("Processing image in ItemCard:", image);

    // Handle base64 images
    if (image.type === "base64" && image.data) {
      // If data is already a complete data URL, return it as is
      if (image.data.startsWith("data:")) {
        return image.data;
      }
      // Otherwise, construct the data URL
      return `data:${image.contentType || "image/jpeg"};base64,${image.data}`;
    }

    // Handle URL images
    if (image.type === "url" && image.url) {
      return image.url;
    }

    // Handle string URLs or base64 data
    if (typeof image === "string") {
      if (image.startsWith("data:")) {
        return image;
      }
      if (image.startsWith("http")) {
        return image;
      }
      // Assume it's a raw base64 string
      return `data:image/jpeg;base64,${image}`;
    }

    // If we get here, log the unhandled format
    console.warn("Unhandled image format in ItemCard:", image);
    return "/placeholder-image.jpg";
  } catch (err) {
    console.error("Error processing image in ItemCard:", err);
    return "/placeholder-image.jpg";
  }
};

export const ItemCard = ({
  id,
  title,
  price,
  brand,
  condition,
  location,
  image,
  onLoginRequired,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const isLoggedIn = localStorage.getItem("loggedin") !== null;
    if (isLoggedIn) {
      navigate(`/item?id=${id}`);
    } else if (onLoginRequired) {
      onLoginRequired();
    } else {
      onLoginRequired();
    }
  };

  return (
    <div
      className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageSrc(image)}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Tag size={16} />
          <span>{brand}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="mt-3">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
              condition === "New"
                ? "bg-green-100 text-green-800"
                : condition === "Used"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {condition}
          </span>
        </div>
      </div>
    </div>
  );
};
