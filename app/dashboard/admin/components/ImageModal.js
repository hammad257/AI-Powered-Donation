import { useEffect } from "react";

export default function ImageModal({ isOpen, images, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
        >
          ✖
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          {images.map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img
                src={img}
                alt={`doc-${i}`}
                className="w-full h-40 object-cover border rounded"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
