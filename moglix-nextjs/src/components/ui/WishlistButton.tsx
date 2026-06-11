"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist, WishlistProductData } from "@/hooks/useWishlist";

interface WishlistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product: WishlistProductData;
  iconSize?: number;
  iconClassName?: string;
  activeIconClassName?: string;
  renderCustom?: (isWishlisted: boolean) => React.ReactNode;
}

export default function WishlistButton({
  product,
  iconSize = 20,
  iconClassName = "text-gray-7",
  activeIconClassName = "text-red fill-red",
  renderCustom,
  className,
  onClick,
  ...props
}: WishlistButtonProps) {
  const { checkWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkWishlisted(product.msn);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      {...props}
    >
      {renderCustom ? (
        renderCustom(isWishlisted)
      ) : (
        <Heart
          size={iconSize}
          strokeWidth={isWishlisted ? 0 : 2.5}
          className={isWishlisted ? activeIconClassName : iconClassName}
        />
      )}
    </button>
  );
}
