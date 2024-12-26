import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";

export const FilterSection = ({
  title,
  isExpanded,
  onToggle,
  items,
  selectedItems,
  onChange,
  type = "checkbox",
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [items]);

  const renderContent = () => {
    if (type === "price-range") {
      return (
        <PriceRangeSlider
          value={[selectedItems.minPrice || 0, selectedItems.maxPrice || 1000]}
          onChange={onChange}
          min={0}
          max={1000}
        />
      );
    }

    return items.map((item) => (
      <label
        key={item}
        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
      >
        <input
          type="checkbox"
          checked={selectedItems.includes(item)}
          onChange={() => onChange(item)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
        />
        <span className="text-sm text-gray-700">{item}</span>
      </label>
    ));
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-800 hover:text-gray-600 transition-colors"
      >
        {title}
        <span className="transform transition-transform duration-300">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      <div
        style={{
          maxHeight: isExpanded ? `${contentHeight + 10}px` : "0px",
          transition: "max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="mt-2">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
