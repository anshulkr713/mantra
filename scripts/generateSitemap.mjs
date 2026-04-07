import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// A dynamic import inside a script execution to read the TS index.ts
// Usually TS files map easily, but we can just parse the barrel file or raw TS files 
// since running TS node in a pure JS script can be tricky without ts-node.

// Let's statically list the known aartis from index.ts or read them from directory
const aartiDir = path.join(process.cwd(), 'src/lib/data/aartis');
const files = fs.readdirSync(aartiDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const DOMAIN = 'https://mantra.toolspoon.com';
const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
const robotsTextPath = path.join(process.cwd(), 'public/robots.txt');

let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add core paths
sitemapContent += `  <url>\n    <loc>${DOMAIN}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
sitemapContent += `  <url>\n    <loc>${DOMAIN}/japacounter</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

// Extract slugs and languages directly from the TS text to avoid TS compilation
console.log(`Generating sitemap for ${files.length} Aartis...`);

files.forEach(file => {
  const content = fs.readFileSync(path.join(aartiDir, file), 'utf-8');
  
  // Regex to find slug
  const slugMatch = content.match(/slug:\s*'([^']+)'/);
  if (!slugMatch) return;
  const slug = slugMatch[1];
  
  // Very rough regex to find translations object keys cleanly:
  // Usually looks like "hindi: {", "english: {"
  const langMatch = content.match(/translations:\s*{([^}]+)}/s);
  if (langMatch) {
     const block = langMatch[1];
     // identify matches like `hindi: { ... }` or `tamil: {`
     const langs = block.match(/([a-z]+):\s*{/g);
     if (langs) {
       langs.forEach(t => {
         const langCode = t.split(':')[0].trim();
         
         sitemapContent += `  <url>\n`;
         sitemapContent += `    <loc>${DOMAIN}/aarti/${slug}/${langCode}</loc>\n`;
         sitemapContent += `    <changefreq>monthly</changefreq>\n`;
         sitemapContent += `    <priority>0.9</priority>\n`;
         sitemapContent += `  </url>\n`;
       });
     }
  }
});

sitemapContent += `</urlset>\n`;

// Write Sitemap
fs.writeFileSync(sitemapPath, sitemapContent);
console.log(`Successfully generated public/sitemap.xml with exhaustive dynamic paths!`);

// Write Robots.txt
const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
fs.writeFileSync(robotsTextPath, robotsContent);
console.log(`Successfully mapped public/robots.txt to Sitemap!`);
