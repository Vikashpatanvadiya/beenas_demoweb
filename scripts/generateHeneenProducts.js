import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const H_FOLDER = path.join(__dirname, '../H');
const OUTPUT_FILE = path.join(__dirname, '../src/data/heneenProducts.js');

function getFilesInDir(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isFile()) {
        files.push({
          name: item.name,
          path: path.join(dir, item.name)
        });
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  return files.sort((a, b) => {
    // Sort by filename, numbers first
    const numA = parseInt(a.name) || 999;
    const numB = parseInt(b.name) || 999;
    if (numA !== numB) return numA - numB;
    return a.name.localeCompare(b.name);
  });
}

function scanHFolder() {
  const products = [];
  
  if (!fs.existsSync(H_FOLDER)) {
    console.error(`H folder not found: ${H_FOLDER}`);
    return products;
  }

  const productFolders = fs.readdirSync(H_FOLDER, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => ({ name: item.name, path: path.join(H_FOLDER, item.name) }))
    .sort((a, b) => {
      // Sort H1, H2, H3, etc.
      const numA = parseInt(a.name.replace('H', '')) || 0;
      const numB = parseInt(b.name.replace('H', '')) || 0;
      return numA - numB;
    });

  productFolders.forEach((productFolder, index) => {
    const productFolderPath = productFolder.path;
    const files = getFilesInDir(productFolderPath);
    
    // Separate images and videos
    // Use lowercase folder name (h1, h2, etc.) and new path structure
    const folderNameLower = productFolder.name.toLowerCase();
    const images = files
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
      .map(f => `/products/heneen/${folderNameLower}/${f.name}`);
    
    const videos = files
      .filter(f => /\.(mp4|mov|webm)$/i.test(f.name))
      .map(f => `/products/heneen/${folderNameLower}/${f.name}`);

    if (images.length > 0) {
      // First image is thumbnail, all images + videos go to gallery
      const productId = `heneen-${productFolder.name.toLowerCase()}`;
      const productName = `Heneen ${productFolder.name.replace('H', '')}`;
      
      // Combine images and videos for the gallery
      const gallery = [...images, ...videos];
      
      products.push({
        id: productId,
        name: productName,
        title: productName,
        collection: 'heneen-collection',
        price: 1299,
        originalPrice: 0,
        description: `Premium ${productName} from the Heneen Collection, crafted with attention to detail and premium quality materials.`,
        category: 'Dresses',
        sizes: ['S', 'M', 'L', 'XL', 'Custom'],
        colors: ['Default'],
        materials: ['Silk'],
        care: ['Dry clean only'],
        features: ['Premium quality', 'Handcrafted', 'Custom fit available'],
        isNew: false,
        isBestSeller: false,
        isOnSale: false,
        inStock: true,
        stockCount: 10,
        serialNumber: index + 1,
        images: gallery, // All images and videos in gallery
        colorVariants: [{
          color: 'Default',
          images: gallery,
          stockCount: 10,
          inStock: true,
          headAlignment: 20
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  return products;
}

const products = scanHFolder();

const output = `// Auto-generated Heneen Collection products from H folder
// Generated at: ${new Date().toISOString()}
// IMPORTANT: These products are ONLY for Heneen Collection
// They should NOT appear in Shop All, New Arrivals, or Best Sellers

export const heneenProducts = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log(`Generated ${products.length} Heneen products in ${OUTPUT_FILE}`);

