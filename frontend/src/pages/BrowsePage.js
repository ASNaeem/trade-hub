import React from "react";

import { SlidersHorizontal } from "lucide-react";

import FilterSidebar from "../components/browse/FilterSideBar";
import SearchHeader from "../components/browse/SearchHeader";
import ProductGrid from "../components/browse/ProductGrid";

const BrowsePage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <SearchHeader />

      <div className="md:hidden w-10 h-10 bg-[#C7D2FE] cursor-pointer rounded-md z-10 fixed right-8 bottom-10 flex items-center justify-center">
        <SlidersHorizontal />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden md:block">
            <FilterSidebar />
          </div>
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Mobile Phones
              </h1>
              <p className="text-gray-500 mt-1">12,345 ads found</p>
            </div>
            <ProductGrid />
          </div>
        </div>
      </div>
    </main>
  );
};

export default BrowsePage;
