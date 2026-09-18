"use client";

import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";

export function ProductGallery({ images, productName }: { images: string[], productName: string }) {
  const [activeImg, setActiveImg] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.5)' // Adjust zoom level here
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-20 md:h-[600px] no-scrollbar">
        {images.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActiveImg(i)}
            className={`relative w-20 h-24 flex-shrink-0 bg-core-muted rounded-sm overflow-hidden transition-all duration-300 ${activeImg === i ? "ring-2 ring-core-ink ring-offset-2" : "opacity-60 hover:opacity-100"}`}
          >
            <Image src={img} alt={`${productName} view ${i + 1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom Effect */}
      <div 
        ref={containerRef}
        className="relative flex-1 aspect-square md:aspect-[4/5] bg-core-muted rounded-sm overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image 
          src={images[activeImg]} 
          alt={productName} 
          fill 
          className="object-cover transition-transform duration-200 ease-out"
          style={zoomStyle}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
