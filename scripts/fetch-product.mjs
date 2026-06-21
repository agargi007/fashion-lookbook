import fs from 'fs';
import * as cheerio from 'cheerio';

const url = process.argv[2];
if (!url) {
  console.error("❌ Error: Please provide a valid product URL.");
  console.error("Usage: node scripts/fetch-product.js <URL>");
  process.exit(1);
}

async function scrapeProduct() {
  try {
    console.log(`🌐 Fetching metadata from: ${url}...`);
    
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP status response error: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Parse OpenGraph and standard meta tags
    const rawTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Unknown Product';
    const imageUrl = $('meta[property="og:image"]').attr('content') || '';
    const rawPrice = $('meta[property="product:price:amount"]').attr('content') || 
                     $('meta[property="og:price:amount"]').attr('content') || 
                     'See Site';

    // Clean up title
    const cleanTitle = rawTitle.split(/[|•-]/)[0].trim();

    // Determine Brand
    let brand = 'Premium Brand';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('everlane')) brand = 'Everlane';
    else if (lowerUrl.includes('coach')) brand = 'Coach';
    else if (lowerUrl.includes('farfetch')) brand = 'Taller Marmo';
    else if (lowerUrl.includes('myntra.com')) {
      try {
        const parsedUrl = new URL(url);
        const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
          const rawBrand = pathSegments[1];
          brand = rawBrand.split(/[+-]/).map(word => {
            if (word === 'jc') return 'JC';
            return word.charAt(0).toUpperCase() + word.slice(1);
          }).join(' ');
          
          if (brand === 'Rare') brand = 'RARE';
          if (brand === 'Stylecast') brand = 'StyleCast';
        } else {
          brand = 'Alberta Ferretti';
        }
      } catch (e) {
        brand = 'Alberta Ferretti';
      }
    }

    // Dynamic Category Classification Rule
    const lowerTitle = cleanTitle.toLowerCase();
    const bagKeywords = ['bag', 'wallet', 'card case', 'clutch', 'tote', 'handbag', 'crossbody', 'purse', 'backpack'];
    const category = bagKeywords.some(keyword => lowerTitle.includes(keyword)) ? 'Bags' : 'Dresses';

    // Update Local JSON Database
    const databasePath = './src/data/lookbook.json';
    let currentArray = [];
    if (fs.existsSync(databasePath)) {
      const fileData = fs.readFileSync(databasePath, 'utf8');
      currentArray = JSON.parse(fileData || '[]');
    }

    // Calculate the next ID sequence based on the highest existing ID number
    const maxIdNum = currentArray.reduce((max, item) => {
      const idNum = parseInt(item.id.replace('look-', ''), 10);
      return idNum > max ? idNum : max;
    }, 0);
    const nextId = `look-${String(maxIdNum + 1).padStart(2, '0')}`;

    const nextItem = {
      id: nextId,
      title: cleanTitle,
      brand: brand,
      category: category,
      imageUrl: imageUrl,
      price: rawPrice !== 'See Site' && !rawPrice.startsWith('$') ? `$${rawPrice}` : rawPrice,
      rawUrl: url
    };

    currentArray.push(nextItem);
    fs.writeFileSync(databasePath, JSON.stringify(currentArray, null, 2));

    console.log(`\n✅ Successfully added to lookbook!`);
    console.log(`   [ID]:       ${nextItem.id}`);
    console.log(`   [Title]:    ${nextItem.title}`);
    console.log(`   [Category]: ${nextItem.category}`);
    console.log(`   [Price]:    ${nextItem.price}\n`);

  } catch (error) {
    console.error("❌ Aggregator extraction failed:", error.message);
  }
}

scrapeProduct();
