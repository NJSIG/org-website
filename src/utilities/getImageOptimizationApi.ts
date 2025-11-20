export const getImageOptimizationApi = () => {
  let url = process.env.IMAGE_OPTIMIZATION_API;

  if (!url) {
    console.warn('Image Optimization API is undefined.', url);

    url = '';
  }

  return url;
};
