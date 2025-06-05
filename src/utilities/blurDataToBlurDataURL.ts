export const blurDataToBlurDataURL = (blurData: string | null | undefined): string | undefined => {
  if (!blurData) {
    return undefined;
  }

  return `data:image/webp;base64,${blurData}`;
};
