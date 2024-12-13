import React from "react";
import ItemDetails from "../components/item_details/ItemDetails";
import SellerInfo from "../components/item_details/SellerInfo";
import SimilarItems from "../components/item_details/SimilarItems";

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ItemDetails item={itemData} />
        <SellerInfo seller={sellerData} />
        <SimilarItems items={similarItems} />
      </div>
    </div>
  );
};

export default ItemDetailsPage;
