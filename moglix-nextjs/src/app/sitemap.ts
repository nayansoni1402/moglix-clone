import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

interface Category {
  slug: string;
  parent?: {
    slug: string;
    parent?: {
      slug: string;
    };
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quantprocure.com";
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337/api";

  // 1. Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // 2. Fetch categories from Strapi to build hierarchical URL paths
  let categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${strapiUrl}/categories?fields[0]=slug&populate[parent][fields][0]=slug&populate[parent][populate][parent][fields][0]=slug&pagination[limit]=1000`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (json && json.data) {
      categoryEntries = json.data.map((cat: Category) => {
        // Construct hierarchy: P2/P1/Cat
        const slugParts = [cat.slug];
        if (cat.parent) {
          slugParts.unshift(cat.parent.slug);
          if (cat.parent.parent) {
            slugParts.unshift(cat.parent.parent.slug);
          }
        }

        return {
          url: `${baseUrl}/category/${slugParts.join("/")}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });
    }
  } catch (err) {
    console.error("[Sitemap] Error fetching categories:", err);
  }

  // 3. Fetch products from Strapi
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${strapiUrl}/products?fields[0]=slug&pagination[limit]=1000`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (json && json.data) {
      productEntries = json.data.map((prod: { slug: string }) => ({
        url: `${baseUrl}/product/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("[Sitemap] Error fetching products:", err);
  }

  return [...staticPages, ...categoryEntries, ...productEntries];
}
