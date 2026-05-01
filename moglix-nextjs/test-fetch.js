const STRAPI_URL = 'http://127.0.0.1:1337';
async function test() {
  try {
    const slug = 'fastgear-fusion-stainless-steel-long-body-tap-pack-of-8';
    const res = await fetch(`${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
  } catch(e) { console.error(e); }
}
test();
