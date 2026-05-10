export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceRaw = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (mrp: number, sellingPrice: number): number => {
  if (!mrp || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

export const getMoglixImageUrl = (
  moglixImageNumber: string,
  size: "thumbnail" | "small" | "medium" | "large" | "xlarge" | "xxlarge" = "xxlarge"
): string => {
  if (!moglixImageNumber) return "/images/products/product-1-bg-1.png";
  return `https://img.moglimg.com/p/${moglixImageNumber}-${size}.jpg`;
};

export const getTagImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `https://img.moglimg.com/${imageUrl}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4) return "bg-green text-white";
  if (rating >= 3) return "bg-yellow text-white";
  return "bg-red text-white";
};

export const sanitizeHtml = (html: string): string => {
  // Basic sanitization — for production use DOMPurify on client
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "");
};
