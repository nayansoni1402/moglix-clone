export default {
  async generate(ctx) {
    try {
      // Access request body or query parameter to determine if we should save or preview
      const save = ctx.request.body && ctx.request.body.save !== false;
      
      const programmaticService: any = strapi.service('api::programmatic-seo.programmatic-seo');
      const results = await programmaticService.generateSeoForCategories({ save });
      
      return ctx.send({
        success: true,
        message: save 
          ? 'Programmatic SEO content generated and successfully updated in database for all categories' 
          : 'Preview generated successfully (dry run)',
        results
      });
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }
  }
};
