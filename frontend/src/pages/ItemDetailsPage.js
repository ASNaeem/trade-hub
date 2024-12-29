import React, { useState, useEffect } from "react";
import ItemDetails from "../components/item_details/ItemDetails";
import SimilarItems from "../components/item_details/SimilarItems";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import ItemService from "../services/itemService";

const ItemDetailsPage = () => {
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get item ID from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const itemId = searchParams.get("id");

        if (!itemId) {
          setError("Item ID not found");
          return;
        }

        // Fetch item details
        const itemData = await ItemService.getItemById(itemId);
        if (!itemData) {
          setError("Item not found");
          return;
        }

        setItem(itemData);
        // For now, we'll use mock seller data until we implement seller details endpoint
        setSeller({
          name: "John Doe",
          memberSince: "2023",
        });

        // Fetch similar items with current item excluded
        const similar = await ItemService.getSimilarItems({
          ...itemData,
          excludeId: itemId,
        });
        setSimilarItems(similar.filter((sItem) => sItem._id !== itemId));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefefe]">
      <Header
        shadow={true}
        className="text-black bg-[#FFF] fill-[var(--buttonColor)]"
      />
      <div className="max-w-7xl mx-auto flex flex-col pt-[100px] px-4 py-8">
        {item && <ItemDetails item={item} seller={seller} />}
        {similarItems.length > 0 && <SimilarItems items={similarItems} />}
      </div>
    </div>
  );
};

export default ItemDetailsPage;
