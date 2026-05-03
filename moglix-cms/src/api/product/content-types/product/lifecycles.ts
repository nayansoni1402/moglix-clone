
export default {
  beforeCreate(event) {
    const { data } = event.params;
    if (data.price && data.mrp) {
      data.discount = Math.round(((data.mrp - data.price) / data.mrp) * 100);
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.price && data.mrp) {
      data.discount = Math.round(((data.mrp - data.price) / data.mrp) * 100);
    }
  },
};
