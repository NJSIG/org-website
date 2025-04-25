export const getServerSideUrl = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = `http://localhost:${process.env.PORT || 3000}`;
  }

  return url;
};
