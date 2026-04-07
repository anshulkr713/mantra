import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

const langMap = {
  hindi: 'hindi',
  sanskrit: 'samskritam',
  english: 'english',
  tamil: 'tamil',
  kannada: 'kannada',
  telugu: 'telugu',
  bangla: 'bengali',
  malayalam: 'malayalam'
};

const VIGNANAM_BASE = 'https://vignanam.org';

async function fetchAarti(page, slug, language) {
  const vignanamLang = langMap[language];
  const url = `${VIGNANAM_BASE}/${vignanamLang}/${slug}.html`;
  console.log(`Fetching ${url} with headless browser...`);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Check if cloudflare blocked us
    if ($('title').text().includes('Just a moment') || $('title').text().includes('Attention Required')) {
        console.error(`Blocked by Cloudflare at ${url}! Sleeping for 15s before giving up...`);
        // we can try waiting if it's a JS challenge
        await page.waitForTimeout(15000);
        const retryHtml = await page.content();
        $ = cheerio.load(retryHtml);
    }

    // We will find all text nodes directly
    let rawText = '';
    
    // Check for standard poem tables or divs first
    const tables = $('table.poem, .poem, .lyrics, article');
    if (tables.length > 0) {
      tables.each((_, el) => {
        rawText += $(el).text() + '\n';
      });
    } else {
      // Fallback to body paragraphs
      $('body').find('p').each((_, el) => {
        const paragraphText = $(el).text().trim();
        // Skip links or navigation texts
        if ($(el).find('a').length > 0 && paragraphText.length < 50) return;
        rawText += paragraphText + '\n';
      });
      if (rawText.trim() === '') {
        rawText = $('body').text();
      }
    }

    // Clean up text
    const lines = rawText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      // filter out common UI strings
      .filter(line => !line.includes('Browse Related Categories') && !line.includes('Vaidika Vignanam') && !line.match(/^[\d\.\s]*$/));

    return lines;

  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return [];
  }
}

async function scrapeAarti(slug, name, deity, emoji, description) {
  const result = {
    slug,
    name,
    deity,
    deityEmoji: emoji,
    description,
    translations: {}
  };

  const titles = {
    hindi: `${name} (Hindi)`,
    sanskrit: `${name} (Sanskrit)`,
    english: `${name} (English)`,
    tamil: `${name} (Tamil)`,
    kannada: `${name} (Kannada)`,
    telugu: `${name} (Telugu)`,
    bangla: `${name} (Bengali)`,
    malayalam: `${name} (Malayalam)`
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const lang of Object.keys(langMap)) {
    let vignanamSlug = slug;
    const verses = await fetchAarti(page, vignanamSlug, lang);
    if (verses.length > 0) {
      result.translations[lang] = {
        title: titles[lang],
        verses
      };
    }
    // Very small polite delay - playwright naturally looks like a real browser
    await new Promise(r => setTimeout(r, 1000));
  }

  await browser.close();
  return result;
}

function generateTsFile(aartiData) {
  let ts = `import type { Aarti } from './index';\n\nexport const ${aartiData.slug.replace(/-([a-z])/g, g => g[1].toUpperCase())}: Aarti = {\n`;
  ts += `  slug: '${aartiData.slug}',\n`;
  ts += `  name: '${aartiData.name}',\n`;
  ts += `  deity: '${aartiData.deity}',\n`;
  ts += `  deityEmoji: '${aartiData.deityEmoji}',\n`;
  ts += `  description: '${aartiData.description.replace(/'/g, "\\'")}',\n`;
  ts += `  translations: {\n`;
  
  for (const [lang, data] of Object.entries(aartiData.translations)) {
    ts += `    ${lang}: {\n`;
    ts += `      title: '${data.title}',\n`;
    ts += `      verses: [\n`;
    for (const v of data.verses) {
        ts += `        '${v.replace(/'/g, "\\'")}',\n`;
    }
    ts += `      ],\n    },\n`;
  }
  ts += `  }\n};\n`;
  
  return ts;
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args[0];
  const vignanamSlug = args[1] || slug;
  const name = args[2];
  const deity = args[3];
  const emoji = args[4];
  const description = args[5];

  console.log(`Starting headless browser scraper tool for ${slug}...`);
  const data = await scrapeAarti(vignanamSlug, name, deity, emoji, description);
  const tsCode = generateTsFile(data);
  
  const destPath = path.join(process.cwd(), 'src/lib/data/aartis/', `${slug}.ts`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, tsCode);
  console.log(`Successfully scraped and saved authentic aarti texts to ${destPath}`);
}

main();
