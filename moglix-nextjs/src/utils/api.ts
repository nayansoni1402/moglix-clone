export async function fetchStrapi(
  endpoint: string,
  queryParams?: Record<string, string | string[]>
) {
  const url = new URL(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Strapi array syntax: populate[0]=favicon&populate[1]=logo
        value.forEach((v, i) => url.searchParams.append(`${key}[${i}]`, v));
      } else {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }

  return response.json();
}
