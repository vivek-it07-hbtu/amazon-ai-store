import { useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';

interface ImageGalleryProps {
  images: { url: string; alt: string }[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="sticky top-4">
      {/* Main Image */}
      <div className="relative bg-white p-4 rounded-lg mb-4">
        <div 
          className="relative h-96 cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={images[selectedImage]?.url || '/placeholder.png'}
            alt={images[selectedImage]?.alt || productName}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full">
            <FiZoomIn className="text-xl" />
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                selectedImage === index
                  ? 'border-amazon-orange'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={images[selectedImage]?.url}
              alt={images[selectedImage]?.alt || productName}
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
