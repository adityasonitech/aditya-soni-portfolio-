export default function robots() {
  const baseUrl = "https://adityasoni-dev.vercel.app";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard-ctrl/', '/portal-access/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
