import React, { useState, useEffect } from "react";
import { Heart, ExternalLink } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getImageSrc = (image) => {
  if (!image) return "";

  if (image.type === "base64" && image.data) {
    if (image.data.startsWith("data:")) {
      return image.data;
    }
    return `data:${image.contentType};base64,${image.data}`;
  }

  return image.url || "";
};

const FavTab = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const favResponse = await axios.get(
          "http://localhost:5000/api/users/my-favourites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const itemPromises = favResponse.data.map((itemId) =>
          axios.get(`http://localhost:5000/api/items/${itemId}`)
        );

        const itemResponses = await Promise.all(itemPromises);
        const favoriteItems = itemResponses.map((response) => response.data);
        setFavorites(favoriteItems);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorite items");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate]);

  return (
    <div
      className={`grid grid-cols-1  ${
        favorites.length !== 0 ? "sm:grid-cols-2 lg:grid-cols-3" : ""
      } gap-6`}
    >
      {favorites.map((item) => (
        <div key={item._id} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={getImageSrc(item.images[0])}
              alt={item.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition"
            />
            <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm">
              <Heart className="h-4 w-4 text-teal-600" fill="currentColor" />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.seller}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                ${item.price}
              </p>
              <a
                href={`item?id=${item._id}`}
                className="text-sm text-[var(--linkTextColor)] hover:text-[var(--linkTextHoverColor)] flex items-center"
              >
                View <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Heart className="h-4 w-4 text-red-500 mr-1" />
              {item.likes} others like this
            </div>
          </div>
        </div>
      ))}

      {favorites.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500">No favorites yet</p>
        </div>
      )}
    </div>
  );
};

export default FavTab;
