import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

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

async function fetchAarti(slug, language) {
  const vignanamLang = langMap[language];
  const url = `${VIGNANAM_BASE}/${vignanamLang}/${slug}.html`;
  console.log(`Fetching ${url}...`);
  
  try {
    const response = await fetch(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return [];
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
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
    console.error(`Error scraping ${url}:`, err);
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

  for (const lang of Object.keys(langMap)) {
    let vignanamSlug = slug;
    // Special cases where the URL slug might differ could be handled here
    const verses = await fetchAarti(vignanamSlug, lang);
    if (verses.length > 0) {
      result.translations[lang] = {
        title: titles[lang],
        verses
      };
    }
    console.log(`Waiting 5 seconds to avoid IP block...`);
    await new Promise(r => setTimeout(r, 5000));
  }

  return result;
}

// Helper to write the typescript file using the result
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
  if (args.length < 5) {
    console.log(`Usage: node scripts/scrapeAartis.mjs <slug> <vignanamSlug_if_different> <name> <deity> <emoji> <description_in_quotes>`);
    console.log(`Example: node scripts/scrapeAartis.mjs hanuman-chalisa hanuman-chalisa "Hanuman Chalisa" "Lord Hanuman" "🐒" "A powerful 40-verse hymn in praise of Lord Hanuman"`);
    // Example default run if no args provided
    console.log(`\nNo arguments passed. Running a quick test scrape...`);
    const defaultData = await scrapeAarti('lakshmi-ashtakam', 'Lakshmi Ashtakam', 'Goddess Lakshmi', '💰', 'A stotram dedicated to Goddess Lakshmi.');
    const tsCode = generateTsFile(defaultData);
    fs.mkdirSync(path.join(process.cwd(), 'src/lib/data/aartis/'), { recursive: true });
    const fp = path.join(process.cwd(), 'src/lib/data/aartis/', defaultData.slug + '.ts');
    fs.writeFileSync(fp, tsCode);
    console.log(`Saved output to ${fp}`);
    process.exit(0);
  }

  const slug = args[0];
  const vignanamSlug = args[1] || slug;
  const name = args[2];
  const deity = args[3];
  const emoji = args[4];
  const description = args[5];

  console.log(`Starting scraper tool for ${slug}...`);
  const data = await scrapeAarti(vignanamSlug, name, deity, emoji, description);
  const tsCode = generateTsFile(data);
  
  const destPath = path.join(process.cwd(), 'src/lib/data/aartis/', `${slug}.ts`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, tsCode);
  console.log(`Successfully scraped and saved authentic aarti texts to ${destPath}`);
}

main();
