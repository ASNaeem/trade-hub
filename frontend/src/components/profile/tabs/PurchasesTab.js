import React from "react";
import { Clock, Package } from "lucide-react";

//#region Fake data
const purchases = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 199,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    status: "Delivered",
    date: "2024-03-15",
    seller: "Audio Tech Co.",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 299,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    status: "In Transit",
    date: "2024-03-10",
    seller: "Tech Gadgets Inc.",
  },
];
//#endregion

const PurchasesTab = () => {
  return (
    <div className="space-y-6">
      {purchases.map((purchase) => (
        <div key={purchase.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 cursor-pointer w-24 h-24">
              <img
                src={purchase.image}
                alt={purchase.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg cursor-pointer font-medium text-gray-900">
                {purchase.title}
              </h4>
              <p className="text-sm text-gray-500">Seller: {purchase.seller}</p>
              <div className="mt-1 flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">
                  Purchased on {purchase.date}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-gray-900">
                ${purchase.price}
              </span>
              <span
                className={`mt-1 px-2 py-1 text-sm rounded-full ${
                  purchase.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {purchase.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchasesTab;
