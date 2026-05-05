"use client";
import React, { useState, useEffect } from "react";
import ProductGallery from "@/components/Product/ProductGallery";
import NewArrival from "@/components/Home/NewArrivals";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist } from "@/redux/features/wishlist-slice";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const dispatch = useDispatch<AppDispatch>();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeImg, setActiveImg] = useState("/images/products/product-1-bg-1.png");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number | null>(null);
  const [helpfulCount, setHelpfulCount] = useState<{[key: number]: number}>({0: 12, 1: 5, 2: 2});
  const [userVoted, setUserVoted] = useState<{[key: number]: boolean}>({});
  const [userRating, setUserRating] = useState(0);
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setReviewImages([...reviewImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const productImages = [
    "/images/products/product-1-bg-1.png",
    "/images/products/product-1-bg-2.png",
  ];

  const dummyReviews = [
    { id: 0, name: "Rahul Sharma", date: "Oct 12, 2023", rating: 5, comment: "Amazing drill machine! The power is more than enough. The kit is very handy.", verified: true, images: ["/images/products/product-1-sm-1.png", "/images/products/product-1-sm-2.png"] },
    { id: 1, name: "Amit Patel", date: "Sep 28, 2023", rating: 4, comment: "Good quality product. Bosch never disappoints.", verified: true, images: ["/images/products/product-2-sm-1.png"] },
    { id: 2, name: "Suresh Gupta", date: "Sep 15, 2023", rating: 5, comment: "Value for money. Hammer mode is very powerful.", verified: false, images: [] },
  ];

  // Flatten all review images into a single gallery list
  const galleryImages = dummyReviews.flatMap(r => r.images.map(img => ({ img, review: r })));

  const toggleHelpful = (id: number) => {
    if (userVoted[id]) {
      setHelpfulCount({ ...helpfulCount, [id]: helpfulCount[id] - 1 });
      setUserVoted({ ...userVoted, [id]: false });
    } else {
      setHelpfulCount({ ...helpfulCount, [id]: helpfulCount[id] + 1 });
      setUserVoted({ ...userVoted, [id]: true });
    }
  };

  const nextImage = () => {
    if (selectedReviewIdx !== null) {
      setSelectedReviewIdx((selectedReviewIdx + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedReviewIdx !== null) {
      setSelectedReviewIdx((selectedReviewIdx - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <main className="bg-[#F4F5F9] min-h-screen pt-[180px] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 xl:px-0 relative">

        {/* Breadcrumb */}
        <div className="text-sm text-dark-3 mb-6 flex items-center gap-2">
          <span className="hover:text-blue cursor-pointer transition-colors">Home</span> 
          <span className="text-gray-4">/</span>
          <span className="hover:text-blue cursor-pointer transition-colors">Power Tools</span> 
          <span className="text-gray-4">/</span>
          <span className="text-dark font-medium capitalize">{slug.replace(/-/g, " ")}</span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-3 shadow-sm flex flex-col lg:flex-row gap-10 mb-8">

          {/* Left Side: Product Gallery */}
          <div className="w-full lg:w-2/5">
             <div className="relative w-full aspect-square bg-white rounded-lg border border-gray-2 overflow-hidden mb-4 group cursor-zoom-in">
                <Image 
                  src={activeImg}
                  alt="Product Image" 
                  fill 
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-150"
                />
             </div>
             <div className="flex gap-3">
                {productImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImg(img)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden p-2 cursor-pointer transition-all ${activeImg === img ? "border-blue shadow-md" : "border-gray-3 hover:border-blue/50"}`}
                  >
                    <Image src={img} alt={`thumb-${i}`} width={80} height={80} className="object-contain w-full h-full" />
                  </div>
                ))}
             </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="w-full lg:w-3/5">
            <h1 className="text-2xl font-bold text-dark mb-2 leading-tight">
              Bosch 500W Professional Hammer Drill Machine, GSB 500 RE Kit
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue font-bold text-sm hover:underline cursor-pointer">BOSCH</span>
              <div className="flex items-center bg-green text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                4.2 ★
              </div>
              <span className="text-dark-4 text-sm font-medium">(124 Reviews)</span>
            </div>

            <div className="bg-[#F8F9FB] rounded-xl p-6 mb-6 border border-gray-1">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black text-dark">₹2,899</span>
                <span className="text-lg text-dark-4 line-through">₹4,200</span>
                <span className="bg-red/10 text-red px-2 py-0.5 rounded text-sm font-bold tracking-tight">31% OFF</span>
              </div>
              <p className="text-xs text-dark-4 font-medium italic">Inclusive of all taxes & free shipping</p>
            </div>

            {/* Product Variants */}
            <div className="mb-8">
               <h3 className="text-xs font-black text-dark uppercase tracking-widest mb-4 flex items-center gap-2">
                  Select Chuck Size <span className="text-blue bg-blue/10 px-2 py-0.5 rounded">Required</span>
               </h3>
               <div className="flex flex-wrap gap-3">
                  {[
                    { label: "10 mm", price: "2899", active: true },
                    { label: "13 mm", price: "3499", active: false },
                    { label: "15 mm", price: "4199", active: false },
                  ].map((variant, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col p-3 min-w-[100px] border-2 rounded-xl cursor-pointer transition-all ${variant.active ? "border-blue bg-blue/5" : "border-gray-2 hover:border-blue/30 bg-white"}`}
                    >
                       <span className={`text-xs font-black uppercase mb-1 ${variant.active ? "text-blue" : "text-dark-4"}`}>{variant.label}</span>
                       <span className="text-sm font-bold text-dark">₹{variant.price}</span>
                       {variant.active && <span className="absolute top-2 right-2 text-blue text-[10px]">✓</span>}
                    </div>
                  ))}
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-3 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center text-xl text-dark hover:bg-gray-1 transition font-bold"
                >-</button>
                <input
                  type="text"
                  value={qty}
                  readOnly
                  className="w-12 h-12 text-center border-x border-gray-3 text-dark font-black outline-none"
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center text-xl text-dark hover:bg-gray-1 transition font-bold"
                >+</button>
              </div>

              <button
                onClick={() => {
                   dispatch(addItemToCart({ id: 101, title: "Bosch Drill", price: 4200, discountedPrice: 2899, quantity: qty, imgs: { previews: [activeImg], thumbnails: [activeImg] } }));
                }}
                className="flex-grow bg-red text-white py-4 rounded-lg font-black text-lg hover:bg-red-dark transition-all shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] active:scale-95 uppercase"
              >
                ADD TO CART
              </button>

              <button
                onClick={() => dispatch(addItemToWishlist({ id: 101, title: "Bosch Drill", price: 4200, discountedPrice: 2899, quantity: 1, imgs: { previews: [activeImg], thumbnails: [activeImg] } }))}
                className="w-14 h-14 flex items-center justify-center bg-white border border-gray-3 rounded-lg text-dark-4 hover:text-red hover:border-red transition-all shadow-sm group"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">❤️</span>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="p-4 border border-blue/10 rounded-xl bg-blue/5">
              <h3 className="text-dark font-bold mb-3 text-sm flex items-center gap-2">
                🚚 Check Delivery Details
              </h3>
              <div className="flex max-w-sm shadow-sm">
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border border-gray-3 rounded-l-lg px-4 py-3 outline-none focus:border-blue flex-grow text-sm"
                />
                <button className="bg-dark text-white px-6 py-3 rounded-r-lg text-sm font-black hover:bg-black transition shadow-md uppercase">
                  CHECK
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl border border-gray-3 shadow-sm mb-10 overflow-hidden">
          <div className="flex border-b border-gray-3 bg-gray-50/50">
            {["description", "specifications", "reviews"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-5 text-sm font-black transition-all uppercase tracking-wider ${activeTab === tab ? "text-blue border-b-2 border-blue bg-white shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]" : "text-dark-4 hover:text-blue"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-10 min-h-[350px]">
            {activeTab === "description" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-black text-dark mb-6">Moglix Overview</h3>
                <p className="text-dark-3 text-base mb-8 leading-loose max-w-4xl">
                  The Bosch GSB 500 RE Professional Hammer Drill machine is a powerful and versatile tool for all your drilling needs. Whether you're a professional tradesperson or a DIY enthusiast, this hammer drill is designed to deliver exceptional performance and durability. Its compact design makes it perfect for tight spaces.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-gray-1 rounded-xl">
                      <h4 className="font-black text-dark mb-4 uppercase text-sm">Main Advantages:</h4>
                      <ul className="space-y-3 text-dark-3 text-sm font-medium">
                        <li className="flex items-center gap-2">✅ Powerful 500W Reliable Motor</li>
                        <li className="flex items-center gap-2">✅ Impact & Regular Mode Switch</li>
                        <li className="flex items-center gap-2">✅ Ergonomic Soft Grip Handle</li>
                      </ul>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-black text-dark mb-6">Technical Specifications</h3>
                <div className="w-full max-w-4xl border border-gray-2 rounded-xl overflow-hidden shadow-sm">
                  {[
                    { label: "Brand", value: "BOSCH" },
                    { label: "Model No", value: "GSB 500 RE" },
                    { label: "Power Input", value: "500 W" },
                    { label: "Chuck Capacity", value: "10 mm" },
                    { label: "No Load Speed", value: "2600 rpm" },
                    { label: "Weight", value: "1.5 kg" },
                  ].map((spec, i) => (
                    <div key={i} className={`flex border-b border-gray-2 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-1"}`}>
                      <div className="w-1/3 p-5 font-black text-dark text-xs uppercase tracking-tight border-r border-gray-2">{spec.label}</div>
                      <div className="w-2/3 p-5 text-dark-3 text-sm font-medium">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-fadeIn">
                <div className="flex flex-col lg:flex-row gap-12 mb-12">
                   {/* Ratings Summary */}
                   <div className="lg:w-1/3 text-center lg:text-left">
                      <div className="text-6xl font-black text-dark mb-2">4.2 <span className="text-2xl text-dark-4 font-bold">/ 5</span></div>
                      <div className="flex justify-center lg:justify-start gap-1 text-2xl text-yellow-500 mb-3">⭐⭐⭐⭐<span className="text-gray-300">⭐</span></div>
                      <p className="text-dark-4 text-xs font-black uppercase tracking-widest mb-6">124 Global Ratings</p>
                      <div className="space-y-4">
                         {[{ star: 5, perc: 65 }, { star: 4, perc: 20 }, { star: 3, perc: 8 }, { star: 2, perc: 4 }, { star: 1, perc: 3 }].map((row) => (
                           <div key={row.star} className="flex items-center gap-4 group">
                              <span className="text-xs font-black text-dark w-12">{row.star} Star</span>
                              <div className="flex-grow h-2.5 bg-gray-2 rounded-full overflow-hidden">
                                 <div 
                                   className="h-full bg-blue rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(46,49,146,0.3)]" 
                                   style={{ width: `${row.perc}%` }}
                                 ></div>
                              </div>
                              <span className="text-xs font-black text-dark-4 w-10 text-right">{row.perc}%</span>
                           </div>
                         ))}
                      </div>
                      <button onClick={() => setShowReviewModal(true)} className="w-full mt-10 bg-white border-2 border-blue text-blue px-10 py-3.5 rounded-xl font-black text-xs hover:bg-blue hover:text-white transition-all shadow-md uppercase tracking-wider">Write A Review</button>
                   </div>

                   {/* Reviews List */}
                   <div className="lg:w-2/3 space-y-8">
                      <h3 className="text-lg font-black text-dark uppercase tracking-tight mb-6">Recent Customer Reviews</h3>
                      {dummyReviews.map((rev, i) => (
                        <div key={i} className="border-b border-gray-1 pb-8 last:border-0">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold">{rev.name[0]}</div>
                                 <div>
                                    <p className="text-sm font-black text-dark leading-none">{rev.name}</p>
                                    <p className="text-[10px] text-dark-4 font-bold mt-1 uppercase">{rev.date}</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => toggleHelpful(rev.id)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-[10px] font-black transition-all ${userVoted[rev.id] ? "bg-blue text-white border-blue shadow-lg scale-105" : "border-gray-3 text-dark-4 hover:border-blue hover:text-blue"}`}
                              >
                                👍 HELPFUL ({helpfulCount[rev.id] || 0})
                              </button>
                           </div>
                           <div className="flex gap-0.5 text-xs text-yellow-500 mb-3">
                              {Array.from({ length: 5 }).map((_, si) => (<span key={si}>{si < rev.rating ? "⭐" : "☆"}</span>))}
                              {rev.verified && <span className="ml-3 bg-green/10 text-green px-2 py-0.5 rounded-[4px] text-[10px] font-black uppercase">Verified Purchase</span>}
                           </div>
                           <p className="text-dark-3 text-sm leading-relaxed font-medium mb-4">{rev.comment}</p>
                           {rev.images.length > 0 && (
                             <div className="flex gap-2">
                               {rev.images.map((img, imgIdx) => {
                                 // Find global index for lightbox
                                 const gIdx = galleryImages.findIndex(gi => gi.img === img);
                                 return (
                                   <div key={imgIdx} onClick={() => setSelectedReviewIdx(gIdx)} className="w-16 h-16 border border-gray-2 rounded-lg overflow-hidden p-1 bg-white hover:border-blue cursor-zoom-in transition-all">
                                     <Image src={img} alt="review" width={64} height={64} className="object-contain w-full h-full" />
                                   </div>
                                 );
                               })}
                             </div>
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <NewArrival title="Frequently Bought Together" viewAllLink="/category/power-tools" />
          <NewArrival title="Related Products" viewAllLink="/category/power-tools" />
          <NewArrival title="Recently Viewed Products" viewAllLink="/shop" />
        </div>
      </div>

      {/* Flipkart Style Review Image Lightbox with Navigation */}
      {selectedReviewIdx !== null && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedReviewIdx(null)}></div>
           
           <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-zoomIn">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedReviewIdx(null)} 
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-2 hover:bg-red hover:text-white rounded-full transition-all z-50 text-xl font-bold"
              >
                ✕
              </button>

              {/* Left Side: Big Image & Navigation */}
              <div className="w-full lg:w-2/3 h-2/3 lg:h-full bg-[#111] flex flex-col relative group">
                 {/* Prev Button */}
                 <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-50 opacity-0 group-hover:opacity-100">
                    <span className="text-2xl">←</span>
                 </button>
                 
                 <div className="flex-grow relative flex items-center justify-center p-10">
                    <Image 
                      src={galleryImages[selectedReviewIdx].img} 
                      alt="Review Gallery" 
                      fill 
                      className="object-contain p-4" 
                    />
                 </div>

                 {/* Next Button */}
                 <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all z-50 opacity-0 group-hover:opacity-100">
                    <span className="text-2xl">→</span>
                 </button>

                 <div className="h-24 bg-black/50 backdrop-blur-md flex items-center justify-center gap-3 p-4 border-t border-white/10 overflow-x-auto">
                    {galleryImages.map((gi, ti) => (
                      <div key={ti} className={`flex-shrink-0 w-14 h-14 border-2 rounded-lg cursor-pointer transition-all ${selectedReviewIdx === ti ? "border-blue scale-110 shadow-lg" : "border-white/20 hover:border-white/50"}`} onClick={() => setSelectedReviewIdx(ti)}>
                         <Image src={gi.img} alt="thumb" width={56} height={56} className="object-contain w-full h-full p-1" />
                      </div>
                    ))}
                 </div>
              </div>

              {/* Right Side: Review Details (Flipkart Style) */}
              <div className="w-full lg:w-1/3 h-1/3 lg:h-full bg-white p-8 overflow-y-auto">
                 <div className="border-b border-gray-1 pb-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-full bg-blue text-white flex items-center justify-center text-xl font-black shadow-lg">
                          {galleryImages[selectedReviewIdx].review.name[0]}
                       </div>
                       <div>
                          <p className="text-lg font-black text-dark leading-none">{galleryImages[selectedReviewIdx].review.name}</p>
                          <p className="text-xs text-dark-4 font-bold mt-1 uppercase tracking-wider">{galleryImages[selectedReviewIdx].review.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                       <div className="bg-green text-white px-2 py-0.5 rounded text-xs font-black flex items-center gap-1 shadow-sm">
                          {galleryImages[selectedReviewIdx].review.rating} ★
                       </div>
                       {galleryImages[selectedReviewIdx].review.verified && (
                         <span className="text-green text-[10px] font-black uppercase tracking-widest bg-green/10 px-2 py-0.5 rounded">Verified Purchase</span>
                       )}
                    </div>
                    <p className="text-dark font-bold text-base leading-relaxed">
                       "{galleryImages[selectedReviewIdx].review.comment}"
                    </p>
                 </div>

                 <div className="space-y-6">
                    <button 
                      onClick={() => toggleHelpful(galleryImages[selectedReviewIdx].review.id)}
                      className={`w-full flex items-center justify-center gap-2 py-3 border-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${userVoted[galleryImages[selectedReviewIdx].review.id] ? "bg-blue text-white border-blue" : "border-gray-2 text-dark-4 hover:border-blue hover:text-blue"}`}
                    >
                       👍 Helpful ({helpfulCount[galleryImages[selectedReviewIdx].review.id] || 0})
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Elegant & Professional Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-zoomIn border border-gray-1">
              
              {/* Header */}
              <div className="px-8 py-5 border-b border-gray-1 flex justify-between items-center bg-white">
                 <h3 className="text-xl font-black text-dark tracking-tight">Write a Review</h3>
                 <button onClick={() => setShowReviewModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-1 text-dark-4 transition-colors">✕</button>
              </div>

              <div className="p-8">
                 {/* Rating */}
                 <div className="mb-8">
                    <label className="block text-xs font-black text-dark-4 mb-4 uppercase tracking-widest">Rate this product</label>
                    <div className="flex gap-3 text-4xl">
                       {[1, 2, 3, 4, 5].map((i) => (
                         <span 
                           key={i} 
                           onClick={() => setUserRating(i)}
                           className={`cursor-pointer transition-all hover:scale-110 ${i <= userRating ? "text-blue drop-shadow-sm" : "text-gray-200"}`}
                         >
                           ★
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* Photos - Elegant Grid */}
                 <div className="mb-8">
                    <label className="block text-xs font-black text-dark-4 mb-4 uppercase tracking-widest">Add Photos</label>
                    <div className="flex flex-wrap gap-4">
                       {reviewImages.map((p, pi) => (
                         <div key={pi} className="relative w-20 h-20 rounded-xl border border-gray-1 overflow-hidden group shadow-sm bg-gray-1">
                            <Image src={p} alt="preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button 
                                 onClick={() => removeImage(pi)} 
                                 className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-dark text-sm shadow-lg hover:bg-red hover:text-white transition-all"
                               >
                                 ✕
                               </button>
                            </div>
                         </div>
                       ))}
                       <label className="w-20 h-20 border-2 border-dashed border-gray-2 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue hover:bg-blue/5 transition-all group">
                          <span className="text-2xl text-gray-300 group-hover:text-blue transition-colors">+</span>
                          <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                       </label>
                    </div>
                 </div>

                 {/* Text Inputs */}
                 <div className="space-y-5">
                    <div>
                       <input 
                         type="text" 
                         placeholder="Review Headline" 
                         className="w-full border-b-2 border-gray-1 focus:border-blue px-0 py-3 text-sm font-bold outline-none transition-all placeholder:font-medium bg-transparent" 
                       />
                    </div>
                    <div>
                       <textarea 
                         rows={4} 
                         placeholder="What did you like or dislike?" 
                         className="w-full border-2 border-gray-1 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue transition-all bg-gray-50/30 resize-none"
                       ></textarea>
                    </div>
                 </div>

                 <button className="w-full mt-8 bg-blue text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-dark transition-all shadow-[0_10px_20px_rgba(46,49,146,0.2)] active:scale-[0.98]">
                    Submit Review
                 </button>
              </div>
           </div>
        </div>
      )}
    </main>
  );
}
