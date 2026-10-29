export default function sitemap() {
  const baseUrl = "https://adityasoni-dev.vercel.app";
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // The admin and login routes are intentionally excluded from the sitemap 
    // to prevent search engine indexing of non-public management areas.
  ];
}
