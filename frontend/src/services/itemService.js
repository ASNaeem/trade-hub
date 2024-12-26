import api from "./api";

const ItemService = {
  // Get all items with optional filters
  getAllItems: async (filters = {}) => {
    try {
      const response = await api.get("/items", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error in getAllItems:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch items");
    }
  },

  // Get a single item by ID
  getItemById: async (id) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in getItemById:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch item");
    }
  },

  // Create a new item
  createItem: async (itemData) => {
    try {
      const response = await api.post("/items", itemData);
      return response.data;
    } catch (error) {
      console.error("Error in createItem:", error);
      throw new Error(error.response?.data?.message || "Failed to create item");
    }
  },

  // Update an existing item
  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error("Error in updateItem:", error);
      throw new Error(error.response?.data?.message || "Failed to update item");
    }
  },

  // Delete an item
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in deleteItem:", error);
      throw new Error(error.response?.data?.message || "Failed to delete item");
    }
  },

  // Get items by filter criteria
  getFilteredItems: async ({
    priceRange,
    brands,
    locations,
    conditions,
    page = 1,
    limit = 6,
  } = {}) => {
    try {
      // Convert arrays to strings to avoid URL encoding issues
      const params = new URLSearchParams();

      // Add pagination params
      params.append("page", page);
      params.append("limit", limit);

      // Add price range if exists
      if (priceRange?.minPrice !== undefined) {
        params.append("minPrice", priceRange.minPrice);
      }
      if (priceRange?.maxPrice !== undefined) {
        params.append("maxPrice", priceRange.maxPrice);
      }

      // Add array parameters
      if (brands?.length) {
        brands.forEach((brand) => params.append("brands", brand));
      }
      if (locations?.length) {
        locations.forEach((location) => params.append("locations", location));
      }
      if (conditions?.length) {
        conditions.forEach((condition) =>
          params.append("conditions", condition)
        );
      }

      const response = await api.get("/items", { params });

      // If the response is not in the expected format, transform it
      if (!response.data.items && Array.isArray(response.data)) {
        return {
          items: response.data,
          totalPages: Math.ceil(response.data.length / limit),
          currentPage: page,
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error in getFilteredItems:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch filtered items"
      );
    }
  },
};

export default ItemService;
