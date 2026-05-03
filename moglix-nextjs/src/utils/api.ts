export async function fetchStrapi(endpoint: string, queryParams?: Record<string, string>) {
  const url = new URL(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}`);
  if (queryParams) {
    Object.keys(queryParams).forEach((key) =>
      url.searchParams.append(key, queryParams[key])
    );
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
