const fs = require('fs');
const path = require('path');

const dir = 'f:\\MyTools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix the duplicate text issue
  content = content.replace(/<!-- Bootstrap 5 \+ Icons & cool font --> & cool font -->/g, '<!-- Bootstrap 5 + Icons & cool font -->');
  fs.writeFileSync(filePath, content, 'utf-8');
  
  // Add to sitemap
  let loc = "https://docfixer.online/" + (file === 'index.html' ? '' : file);
  let priority = '0.8';
  if (file === 'index.html') priority = '1.0';
  if (['privacy.html', 'terms.html', 'disclaimer.html'].includes(file)) priority = '0.3';
  
  sitemapXml += "  <url>\n    <loc>" + loc + "</loc>\n    <priority>" + priority + "</priority>\n  </url>\n";
});

sitemapXml += `</urlset>`;

fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml, 'utf-8');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://docfixer.online/sitemap.xml
`;

fs.writeFileSync(path.join(dir, 'robots.txt'), robotsTxt, 'utf-8');

console.log('✅ Cleaned up HTML files and generated sitemap.xml & robots.txt');
