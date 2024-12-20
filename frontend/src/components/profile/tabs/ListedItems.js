import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import Modal from "../../edit_item/Modal";
import ItemEditForm from "../../edit_item/ItemEditForm.js";

//#region Fake data
// const items = [
//   {
//     id: 1,
//     title: "Vintage Leather Jacket",
//     price: 120,
//     image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
//     likes: 24,
//     timeLeft: "2 days",
//   },
//   {
//     id: 2,
//     title: "Mechanical Keyboard",
//     price: 85,
//     image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400",
//     likes: 15,
//     timeLeft: "5 days",
//   },
//   {
//     id: 3,
//     title: "Retro Camera",
//     price: 150,
//     image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
//     likes: 32,
//     timeLeft: "1 day",
//   },
// ];
//#endregion

function ListedItems({ items }) {
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const handleSave = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Listed Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <>
            <Modal
              isOpen={IsModalOpen && item.id === selectedItemId}
              onClose={() => setIsModalOpen(false)}
              title="Edit Item"
            >
              <ItemEditForm
                item={item}
                onSave={handleSave}
                onDelete={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
              />
            </Modal>
            <div className="card group">
              <div
                className="relative cursor-pointer aspect-square overflow-hidden rounded-lg bg-gray-100"
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedItemId(item.id);
                }}
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm !select-text  font-medium text-gray-900">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg !select-text font-semibold text-gray-900">
                    ${item.price}
                  </p>
                </div>
                <div className="flex flex-col justify-between pr-5 mt-1">
                  <p className="text-sm !select-text text-gray-500 mt-1">
                    Condition: {item.condition} • Quantity: {item.quantity}
                  </p>
                  <p className="text-sm !select-text text-gray-500 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </>
        ))}
        <div className="card group select-none">
          <div
            className="flex flex-col justify-center items-center border-[2px] transition-all duration-150 hover:bg-gray-100 border-dashed border-gray-300 hover:border-[2px] hover:border-cyan-500 cursor-pointer aspect-square overflow-hidden rounded-lg"
            onClick={() => {
              window.location.href = "/create_item";
            }}
          >
            <PlusIcon size={30} className="text-gray-400" />
            <span className="text-sm text-gray-500 mt-1">New Listing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListedItems;
