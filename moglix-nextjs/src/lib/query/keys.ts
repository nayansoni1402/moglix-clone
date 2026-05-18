export const queryKeys = {
  product: {
    details: (msn: string) => ["product", "details", msn] as const,
    reviews: (msn: string) => ["product", "reviews", msn] as const,
    similar: (msn: string) => ["product", "similar", msn] as const,
  },
};
