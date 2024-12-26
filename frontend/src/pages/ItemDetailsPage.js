import React from "react";
import ItemDetails from "../components/item_details/ItemDetails";
import SellerInfo from "../components/item_details/SellerInfo";
import SimilarItems from "../components/item_details/SimilarItems";
import Header from "../components/Header";

//#region fake data
import {
  itemData,
  sellerData,
  similarItems,
} from "../data/mockdata_itemdetails";
//#endregion

const ItemDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        shadow={true}
        className="text-black bg-[#FFF] overflow-hidden fill-[var(--buttonColor)]"
      />
      <div className="max-w-7xl mx-auto pt-[100px] px-4 py-8">
        <ItemDetails item={itemData} />
        <SellerInfo seller={sellerData} />
        <SimilarItems items={similarItems} />
      </div>
    </div>
  );
};

export default ItemDetailsPage;
