import fallbackProducts from "@/components/Shop/shopData";
import { Product } from "@/types/product";

const CMS_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ??
  "http://localhost:1337";

type StrapiEntity = {
  id?: number;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
};

type StrapiMedia = {
  url?: string;
  formats?: Record<string, { url?: string }>;
  attributes?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  };
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const absoluteUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${CMS_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const mediaUrl = (media: unknown, preferredFormat: "thumbnail" | "large") => {
  const item = media as StrapiMedia | undefined;
  const attributes = item?.attributes;

  return absoluteUrl(
    attributes?.formats?.[preferredFormat]?.url ??
      item?.formats?.[preferredFormat]?.url ??
      attributes?.formats?.medium?.url ??
      item?.formats?.medium?.url ??
      attributes?.formats?.small?.url ??
      item?.formats?.small?.url ??
      attributes?.url ??
      item?.url
  );
};

const getMediaArray = (value: unknown) => {
  if (Array.isArray(value)) return value;

  const media = value as { data?: unknown } | undefined;
  if (Array.isArray(media?.data)) return media.data;

  return [];
};

const mapProduct = (entity: StrapiEntity, index: number): Product => {
  const attributes = entity.attributes ?? entity;
  const fallbackProduct = fallbackProducts[index % fallbackProducts.length];
  const images = getMediaArray(attributes.images);
  const firstImage = images[0];
  const mainImage = absoluteUrl(attributes.mainImageUrl as string | undefined);
  const thumbnails = images
    .map((image) => mediaUrl(image, "thumbnail"))
    .filter(Boolean) as string[];
  const previews = images
    .map((image) => mediaUrl(image, "large"))
    .filter(Boolean) as string[];
  const image =
    mainImage ??
    mediaUrl(firstImage, "large") ??
    mediaUrl(firstImage, "thumbnail") ??
    fallbackProduct.imgs?.previews?.[0] ??
    "/images/products/product-1-bg-1.png";
  const discountedPrice = toNumber(attributes.price, fallbackProduct.discountedPrice);
  const price = toNumber(attributes.mrp, discountedPrice || fallbackProduct.price);

  return {
    id: toNumber(entity.id, index + 1),
    title: String(attributes.name ?? fallbackProduct.title),
    reviews: toNumber(attributes.reviewCount, toNumber(attributes.rating, fallbackProduct.reviews)),
    price,
    discountedPrice,
    imgs: {
      thumbnails: thumbnails.length ? thumbnails : [image],
      previews: previews.length ? previews : [image],
    },
  };
};

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/products?populate=*&pagination[pageSize]=24&sort=createdAt:desc`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`CMS responded with ${response.status}`);
    }

    const payload = await response.json();
    const data = Array.isArray(payload?.data) ? payload.data : [];
    const products = data.map(mapProduct).filter((product) => product.title);

    return products.length ? products : fallbackProducts;
  } catch (error) {
    console.warn("Falling back to template products:", error);
    return fallbackProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`CMS responded with ${response.status}`);
    }

    const payload = await response.json();
    const data = Array.isArray(payload?.data) ? payload.data : [];
    
    if (data.length === 0) return null;
    
    return mapProduct(data[0], 0);
  } catch (error) {
    console.warn("Error fetching product by slug:", error);
    return null;
  }
}
