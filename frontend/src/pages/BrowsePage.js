import React from "react";
import { ItemCard } from "../components/browse/ItemCard";
import { Filters } from "../components/browse/Filters";
import { Pagination } from "../components/browse/Pagination";
import { Menu, PackageSearch, Search } from "lucide-react";
import Header from "../components/Header";
import useItems from "../hooks/useItems";

// Define filter options that match our backend data
const FILTERS = {
  brands: ["Levi's", "Fossil", "Sony", "Apple", "Dell", "Other"],
  locations: ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"],
  conditions: ["New", "Like New", "Used", "Refurbished"],
};

const ITEMS_PER_PAGE = 6;

const BrowsePage = () => {
  const [selectedFilters, setSelectedFilters] = React.useState({
    priceRange: { minPrice: 0, maxPrice: 1000 },
    brands: [],
    locations: [],
    conditions: [],
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [hasActiveFilters, setHasActiveFilters] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Use our custom hook with initial fetch
  const { items, loading, error, totalPages, fetchItems } = useItems({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Check if any filters are active
  React.useEffect(() => {
    const activeFilters =
      selectedFilters.brands.length > 0 ||
      selectedFilters.locations.length > 0 ||
      selectedFilters.conditions.length > 0 ||
      selectedFilters.priceRange.minPrice > 0 ||
      selectedFilters.priceRange.maxPrice < 1000;
    setHasActiveFilters(activeFilters);
  }, [selectedFilters]);

  // Initial fetch when component mounts
  React.useEffect(() => {
    fetchItems({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      priceRange: selectedFilters.priceRange,
      search: searchTerm,
    });
  }, [currentPage, selectedFilters, searchTerm]);

  const handleFilterChange = (filterType, value) => {
    let newFilters;

    if (filterType === "priceRange") {
      newFilters = {
        ...selectedFilters,
        priceRange: value,
      };
    } else {
      newFilters = {
        ...selectedFilters,
        [filterType]: selectedFilters[filterType].includes(value)
          ? selectedFilters[filterType].filter((item) => item !== value)
          : [...selectedFilters[filterType], value],
      };
    }

    setSelectedFilters(newFilters);
    setCurrentPage(1);

    // Prepare filter parameters for API
    const apiFilters = {
      page: 1,
      limit: ITEMS_PER_PAGE,
      priceRange: newFilters.priceRange,
    };

    // Only add non-empty filters
    if (newFilters.brands.length > 0) {
      if (newFilters.brands.includes("Other")) {
        apiFilters.brands = [
          ...newFilters.brands.filter((b) => b !== "Other"),
          null,
        ];
      } else {
        apiFilters.brands = newFilters.brands;
      }
    }

    if (newFilters.locations.length > 0) {
      apiFilters.locations = newFilters.locations;
    }

    if (newFilters.conditions.length > 0) {
      apiFilters.conditions = newFilters.conditions;
    }

    // Fetch items with new filters
    fetchItems(apiFilters);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // Prepare filter parameters for API
    const apiFilters = {
      page: newPage,
      limit: ITEMS_PER_PAGE,
      priceRange: selectedFilters.priceRange,
    };

    // Only add non-empty filters
    if (selectedFilters.brands.length > 0) {
      if (selectedFilters.brands.includes("Other")) {
        apiFilters.brands = [
          ...selectedFilters.brands.filter((b) => b !== "Other"),
          null,
        ];
      } else {
        apiFilters.brands = selectedFilters.brands;
      }
    }

    if (selectedFilters.locations.length > 0) {
      apiFilters.locations = selectedFilters.locations;
    }

    if (selectedFilters.conditions.length > 0) {
      apiFilters.conditions = selectedFilters.conditions;
    }

    fetchItems(apiFilters);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading items...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error: {error}</p>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-center py-12 space-y-4">
          <PackageSearch className="mx-auto h-16 w-16 text-gray-400" />
          {hasActiveFilters ? (
            <>
              <p className="text-gray-500 text-lg">
                No items match your selected filters.
              </p>
              <p className="text-gray-400">
                Try adjusting your filters to find what you're looking for.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">No items available yet.</p>
              <p className="text-gray-400">
                Check back later for new items or try adjusting your search.
              </p>
            </>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              price={item.price}
              brand={item.brand}
              condition={item.condition}
              location={item.location}
              image={item.images[0]}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#fefefe]">
      <Header
        shadow={true}
        className="text-black !fixed bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />
      <div className="max-w-7xl mx-auto px-4 py-24">
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
              priceRange={selectedFilters.priceRange}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <Menu size={20} />
                Filters
              </button>
              <div className="w-full relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search items..."
                  className="border w-full rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--iconColor)]"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
