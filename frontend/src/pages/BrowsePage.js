import React from "react";
import { ItemCard } from "../components/browse/ItemCard";
import { Filters } from "../components/browse/Filters";
import { Pagination } from "../components/browse/Pagination";
import { Menu } from "lucide-react";
import Header from "../components/Header";

// Sample data - expanded for pagination demo
const MOCK_ITEMS = Array.from({ length: 20 }, (_, index) => ({
  id: String(index + 1),
  title: [
    "Vintage Leather Jacket",
    "Designer Watch",
    "Gaming Console",
    "Smartphone",
    "Laptop",
  ][index % 5],
  price: [129.99, 299.99, 399.99, 599.99, 999.99][index % 5],
  brand: ["Levi's", "Fossil", "Sony", "Apple", "Dell"][index % 5],
  condition: ["New", "Used", "Refurbished"][index % 3],
  location: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"][
    index % 5
  ],
  imageUrl:
    [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    ][index % 5] + "?auto=format&fit=crop&q=80&w=500",
}));

const FILTERS = {
  priceRanges: ["$0-$50", "$51-$100", "$101-$200", "$200+"],
  brands: ["Levi's", "Fossil", "Sony", "Apple", "Dell"],
  locations: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"],
  conditions: ["New", "Used", "Refurbished"],
};

const ITEMS_PER_PAGE = 6;

const BrowsePage = () => {
  const [selectedFilters, setSelectedFilters] = React.useState({
    priceRanges: [],
    brands: [],
    locations: [],
    conditions: [],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredItems = MOCK_ITEMS.filter((item) => {
    const priceRange =
      selectedFilters.priceRanges.length === 0 ||
      selectedFilters.priceRanges.some((range) => {
        const [min, max] = range
          .replace("$", "")
          .split("-")
          .map((val) => (val === "+" ? Infinity : Number(val)));
        return item.price >= min && item.price <= max;
      });

    const brand =
      selectedFilters.brands.length === 0 ||
      selectedFilters.brands.includes(item.brand);

    const location =
      selectedFilters.locations.length === 0 ||
      selectedFilters.locations.includes(item.location);

    const condition =
      selectedFilters.conditions.length === 0 ||
      selectedFilters.conditions.includes(item.condition);

    return priceRange && brand && location && condition;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fefefe]">
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <Menu size={20} />
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div
            className={`md:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden"
            } md:block transition-all duration-300`}
          >
            <Filters
              filters={FILTERS}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No items match your selected filters.
                </p>
              </div>
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
