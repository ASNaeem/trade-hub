import React, { useState } from "react";
import { FilterSection } from "./FilterSection";

export const Filters = ({ filters, selectedFilters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    location: true,
    condition: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
        items={filters.priceRanges}
        selectedItems={selectedFilters.priceRanges}
        onChange={(value) => onFilterChange("priceRanges", value)}
      />
      <FilterSection
        title="Brand"
        isExpanded={expandedSections.brand}
        onToggle={() => toggleSection("brand")}
        items={filters.brands}
        selectedItems={selectedFilters.brands}
        onChange={(value) => onFilterChange("brands", value)}
      />
      <FilterSection
        title="Location"
        isExpanded={expandedSections.location}
        onToggle={() => toggleSection("location")}
        items={filters.locations}
        selectedItems={selectedFilters.locations}
        onChange={(value) => onFilterChange("locations", value)}
      />
      <FilterSection
        title="Condition"
        isExpanded={expandedSections.condition}
        onToggle={() => toggleSection("condition")}
        items={filters.conditions}
        selectedItems={selectedFilters.conditions}
        onChange={(value) => onFilterChange("conditions", value)}
      />
    </div>
  );
};
