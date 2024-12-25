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
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`relative max-w-[70%] ${
            isOwn
              ? "bg-[var(--buttonColor)] text-white"
              : "bg-gray-100 text-gray-900"
          } rounded-lg p-3`}
        >
          <div className="flex flex-col">
            {!isOwn && senderName && (
              <div className="text-xs font-medium text-gray-500 mb-1 hover:text-gray-700 transition-colors">
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
                      className="max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-200"
                      onClick={() => setSelectedImage(url)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div
              className={`text-xs mt-1 ${
                isOwn ? "text-indigo-200" : "text-gray-500"
              } text-right relative group`}
              onMouseMove={handleMouseMove}
            >
              <span>{formatMessageTime(timestamp)}</span>
              <div
                className={`fixed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isOwn ? "bg-gray-700" : "bg-gray-800"
                } text-white px-2 py-1 rounded text-xs whitespace-nowrap`}
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y - 30}px`,
                }}
              >
                {new Date(timestamp).toLocaleString()}
              </div>
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
