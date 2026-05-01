const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getProductBySlug(slug: string) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
