export default {
  routes: [
    {
      method: 'POST',
      path: '/programmatic-seo/generate',
      handler: 'programmatic-seo.generate',
      config: {
        auth: false,
      },
    },
  ],
};
