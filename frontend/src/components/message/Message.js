import React, { useState } from "react";
import { ImageModal } from "./ImageModal";
import { formatMessageTime } from "../../frontend_util/DateUtils";

export function Message({ text, timestamp, imageUrls, isOwn, senderName }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`relative max-w-[70%] ${
            isOwn ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
          } rounded-lg p-3`}
        >
          <div className="flex flex-col">
            {!isOwn && senderName && (
              <div className="text-xs font-medium text-gray-500 mb-1">
                {senderName}
              </div>
            )}
            <div className="space-y-2">
              {text && <p className="break-words">{text}</p>}
              {imageUrls && imageUrls.length > 0 && (
                <div className="flex flex-col flex-wrap gap-2">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Message attachment ${index + 1}`}
                      className="max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(url)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div
              className={`text-xs mt-1 ${
                isOwn ? "text-indigo-200" : "text-gray-500"
              } text-right`}
            >
              {formatMessageTime(timestamp)}
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
