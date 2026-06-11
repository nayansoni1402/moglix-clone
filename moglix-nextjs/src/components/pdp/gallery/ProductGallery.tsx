"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X, Play, Share2 } from "lucide-react";
import { getMoglixImageUrl } from "@/lib/utils/product";
import type { ProductImage, ProductTag } from "@/types/product";
import WishlistButton from "@/components/ui/WishlistButton";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  videos?: any[];
  msn?: string;
  tags?: ProductTag[];
}

export default function ProductGallery({ images, productName, videos = [], msn, tags }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIdx];

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, images.length]);

  if (!images.length) return null;

  const mainImageUrl = getMoglixImageUrl(activeImage.moglixImageNumber, "xxlarge");

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-white rounded-xl border border-gray-1 overflow-hidden">
          <div
            ref={imageRef}
            className="relative w-full h-full cursor-zoom-in group isolate transform-gpu"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setFullscreen(true)}
          >
            <Image
              src={mainImageUrl}
              alt={activeImage.altTag || productName}
              fill
              priority={activeIdx === 0}
              className={`object-contain p-8 transition-transform duration-200 ${
                zoomed ? "scale-[2.5]" : "scale-100"
              }`}
              style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 shadow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Zoom icon */}
            <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <ZoomIn size={15} className="text-dark-4" />
            </div>

            {/* Dots indicator (mobile only) */}
            {images.length > 1 && (
              <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`rounded-full transition-all ${
                      activeIdx === idx ? "w-4 h-1.5 bg-blue" : "w-1.5 h-1.5 bg-gray-3"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
            <button 
              onClick={handleShare}
              className="w-11 h-11 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
              aria-label="Share product"
            >
              <Share2 size={20} className="text-gray-7" strokeWidth={2.5} />
            </button>
            <WishlistButton
              product={{
                msn: msn || "",
                name: productName,
                image: images[0] ? getMoglixImageUrl(images[0].moglixImageNumber, "xxlarge") : undefined
              }}
              className="w-11 h-11 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95"
              iconSize={20}
            />
          </div>

          {/* Badges from API */}
          {tags && tags.length > 0 && (
            <div className="absolute top-6 left-0 z-10 flex flex-col items-start gap-2 pointer-events-none">
              {[...tags].sort((a, b) => (a.tagPriority || 0) - (b.tagPriority || 0)).map((tag) => {
                if (tag.tagType === "image" && tag.tagImageLink) {
                  return (
                    <img 
                      key={tag.tagId} 
                      src={tag.tagImageLink} 
                      alt={tag.tagName} 
                      className="h-6 object-contain" 
                    />
                  );
                } else {
                  return (
                    <div 
                      key={tag.tagId} 
                      className="bg-[#008f85] text-white text-[10px] font-bold px-3 py-1.5 rounded-r shadow-sm uppercase tracking-wide flex items-center relative"
                    >
                      {tag.tagName}
                      <div className="absolute right-[-6px] top-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[6px] border-l-[#008f85]" />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Horizontal Thumbnails Desktop & Mobile */}
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-[60px] h-[60px] border rounded-lg overflow-hidden bg-white transition-all duration-200 ${
                activeIdx === idx
                  ? "border-red shadow-sm ring-1 ring-red"
                  : "border-gray-2 hover:border-gray-3"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={getMoglixImageUrl(img.moglixImageNumber, "thumbnail")}
                alt={img.altTag || `${productName} - Image ${idx + 1}`}
                width={60}
                height={60}
                className="object-contain w-full h-full p-1"
                loading="lazy"
              />
            </button>
          ))}
          {videos.length > 0 && (
            <button
              className="w-[60px] h-[60px] border border-gray-2 hover:border-gray-3 rounded-lg overflow-hidden bg-gray-1 flex items-center justify-center transition-all"
              aria-label="Play video"
            >
              <Play size={20} className="text-dark-4" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Modal (Portaled) */}
      {fullscreen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-white/90 backdrop-blur-md flex flex-col" onClick={() => setFullscreen(false)}>
          <div className="flex justify-between items-center px-6 py-4">
            <span className="text-dark-2 text-sm font-bold">
              {activeIdx + 1} / {images.length}
            </span>
            <button
              onClick={() => setFullscreen(false)}
              className="p-2 bg-gray-1 hover:bg-gray-2 rounded-full transition-colors"
            >
              <X size={24} className="text-dark-2" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-12 pb-12">
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-6 w-12 h-12 bg-white shadow-lg border border-gray-2 rounded-full flex items-center justify-center text-dark-2 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="relative w-full h-full max-w-5xl max-h-[80vh] bg-white shadow-2xl rounded-2xl p-4 flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <Image
                src={getMoglixImageUrl(activeImage.moglixImageNumber, "xxlarge")}
                alt={activeImage.altTag || productName}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>

            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-6 w-12 h-12 bg-white shadow-lg border border-gray-2 rounded-full flex items-center justify-center text-dark-2 hover:bg-gray-50 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 px-4 pb-6 overflow-x-auto justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                className={`flex-shrink-0 w-14 h-14 border-2 rounded-lg overflow-hidden transition-all ${
                  activeIdx === idx ? "border-blue scale-110" : "border-white/20"
                }`}
              >
                <Image
                  src={getMoglixImageUrl(img.moglixImageNumber, "thumbnail")}
                  alt={`thumb ${idx + 1}`}
                  width={56}
                  height={56}
                  className="object-contain w-full h-full bg-white"
                />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
