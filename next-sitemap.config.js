/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://agbarabadagrypropertycenter.com",
  generateRobotsTxt: true, // creates robots.txt
  sitemapSize: 7000, // splits sitemap if more than 7000 URLs
  changefreq: "daily",
  priority: 0.8,
  exclude: ["/admin/*", "/agent/*"], // exclude private pages
  transform: async (config, url) => {
    // Optional: add custom priority or changefreq per page
    let priority = 0.8;
    let changefreq = "daily";

    if (url.includes("/properties/")) {
      priority = 1.0; // higher priority for property pages
      changefreq = "hourly"; // properties update often
    }

    return {
      loc: url, // URL of page
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  }, 
};
