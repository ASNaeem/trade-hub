import React from "react";
import ListingForm from "../components/edit_item/ListingForm";
import Header from "../components/Header";

const CreateListing = () => {
  return (
    <div>
      <Header
        shadow={true}
        className="text-black bg-[#FFFFFF] overflow-hidden fill-[#49647D]"
      />
      <ListingForm className="pt-[100px]" />
    </div>
  );
};

export default CreateListing;
