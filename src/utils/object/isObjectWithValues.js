export const isObjectWithValues = (obj) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
};
