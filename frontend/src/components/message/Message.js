import React, { useState } from "react";
import { ImageModal } from "./ImageModal";
import { formatMessageTime } from "../../frontend_util/DateUtils";

export function Message({ text, timestamp, imageUrls, isOwn, senderName }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <div
        className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"} group`}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`relative max-w-[70%] rounded-lg p-3 ${
            isOwn
              ? "bg-[var(--buttonColor)] text-white rounded-tr-none ml-12"
              : "bg-white text-gray-900 rounded-tl-none mr-12 shadow-sm"
          }`}
        >
          {/* Sender Name */}
          {!isOwn && (
            <div className="text-xs font-medium text-[var(--buttonColor)] mb-1">
              {senderName}
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            {text && <p className="break-words text-sm">{text}</p>}
            {imageUrls && imageUrls.length > 0 && (
              <div className="flex flex-col flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Message attachment ${index + 1}`}
                    className="max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-200"
                    onClick={() => setSelectedImage(url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1 ${
              isOwn ? "text-white/80" : "text-gray-500"
            } text-right`}
          >
            {formatMessageTime(timestamp)}
          </div>

          {/* Message Tail */}
          <div
            className={`absolute top-0 w-4 h-4 ${
              isOwn
                ? "right-0 transform translate-x-1/3 -translate-y-1/3"
                : "left-0 transform -translate-x-1/3 -translate-y-1/3"
            }`}
          >
            <div
              className={`absolute transform rotate-45 w-3 h-3 ${
                isOwn ? "bg-[var(--buttonColor)]" : "bg-white"
              }`}
            />
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
