export const generateSitemap = async (): Promise<string> => {
  const baseUrl = "https://consorcio-hirayama-eeva.vercel.app";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: baseUrl, priority: "1.0", changefreq: "weekly" },
    { url: `${baseUrl}/conteudo`, priority: "0.8", changefreq: "weekly" },
    { url: `${baseUrl}/salaryfits`, priority: "0.7", changefreq: "monthly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
};
