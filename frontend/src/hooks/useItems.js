import { useState, useEffect } from "react";
import ItemService from "../services/itemService";

const useItems = (initialFilters = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchItems = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ItemService.getFilteredItems(filters);

      // Handle both array response and paginated response structures
      if (Array.isArray(data)) {
        setItems(data);
        setTotalPages(Math.ceil(data.length / (filters.limit || 6)));
      } else {
        setItems(data.items || []);
        setTotalPages(
          data.totalPages ||
            Math.ceil((data.items?.length || 0) / (filters.limit || 6))
        );
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError(err.message);
      setItems([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchItems(initialFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items,
    loading,
    error,
    totalPages,
    fetchItems,
  };
};

export default useItems;
