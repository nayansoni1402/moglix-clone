"use client";

import { useState } from "react";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import type { ProductReviews } from "@/types/product";
import { formatDate } from "@/lib/utils/product";

interface ReviewsSectionProps {
  reviews: ProductReviews;
}

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "text-yellow fill-yellow" : "text-gray-3"}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [helpful, setHelpful] = useState<Record<number, boolean>>({});
  const { summaryData, reviewList } = reviews;

  const ratingBars = [
    { star: 5, count: summaryData.fiveStarCount },
    { star: 4, count: summaryData.fourStarCount },
    { star: 3, count: summaryData.threeStarCount },
    { star: 2, count: summaryData.twoStarCount },
    { star: 1, count: summaryData.oneStarCount },
  ];

  const totalRatings = summaryData.finalRating;

  return (
    <div>
      <h2 className="text-lg font-bold text-body mb-6">Customer Reviews & Ratings</h2>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-gray-1 rounded-xl p-5 text-center mb-4">
            <div className="text-5xl font-black text-body mb-1">
              {summaryData.finalAverageRating.toFixed(1)}
            </div>
            <div className="text-xs font-bold text-dark-4 mb-3">OUT OF 5</div>
            <StarDisplay rating={summaryData.finalAverageRating} size={18} />
            <div className="text-xs text-gray-5 font-medium mt-2">
              {summaryData.reviewCount} reviews
            </div>
          </div>

          {/* Star breakdown */}
          <div className="space-y-2">
            {ratingBars.map(({ star, count }) => {
              const pct = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-dark-4 w-8 text-right shrink-0">
                    {star} ★
                  </span>
                  <div className="flex-1 h-2 bg-gray-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-5 font-medium w-8 shrink-0">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 min-w-0 space-y-6">
          {reviewList.map((review) => (
            <div key={review.id} className="border-b border-gray-1 pb-6 last:border-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center text-blue font-bold text-sm shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-body leading-none">{review.userName}</p>
                    <p className="text-[11px] text-gray-5 font-medium mt-0.5">
                      {formatDate(review.updatedAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setHelpful((h) => ({ ...h, [review.id]: !h[review.id] }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    helpful[review.id]
                      ? "bg-blue text-white border-blue"
                      : "border-gray-2 text-dark-4 hover:border-blue hover:text-blue"
                  }`}
                >
                  <ThumbsUp size={12} />
                  Helpful
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`flex items-center gap-1 text-white text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    review.rating >= 4
                      ? "bg-green"
                      : review.rating >= 3
                      ? "bg-yellow"
                      : "bg-red"
                  }`}
                >
                  {review.rating} <Star size={9} fill="white" />
                </div>
                <span className="text-sm font-bold text-body">{review.reviewSubject}</span>
                <span className="flex items-center gap-1 text-[11px] text-green font-bold">
                  <CheckCircle size={11} />
                  Verified Purchase
                </span>
              </div>

              <p className="text-sm text-dark-3 font-medium leading-relaxed">
                {review.reviewText}
              </p>
            </div>
          ))}

          {reviewList.length === 0 && (
            <div className="text-center py-8 text-dark-4 text-sm">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
