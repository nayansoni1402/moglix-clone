export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceRaw = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (mrp: number, sellingPrice: number): number => {
  if (!mrp || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

export const NO_IMAGE_URL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f3f4f6"/><g transform="translate(110, 95)" stroke="%239ca3af" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="74" height="74" rx="8"/><circle cx="40" cy="40" r="16"/><path d="M77 53L57 33L21 69"/><path d="M77 65L69 57L62 64"/></g><text x="150" y="210" fill="%239ca3af" font-family="system-ui, sans-serif" font-size="16" font-weight="500" text-anchor="middle">No Image Available</text></svg>`;

export const getMoglixImageUrl = (
  moglixImageNumber: string,
  size: "thumbnail" | "small" | "medium" | "large" | "xlarge" | "xxlarge" = "xxlarge"
): string => {
  return NO_IMAGE_URL;
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
