import { copyFileSync } from 'fs';
import { join } from 'path';

// Copy the built index.html to 404.html for GitHub Pages SPA routing
const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
  copyFileSync(indexPath, notFoundPath);
  console.log('✅ Successfully copied index.html to 404.html');
} catch (error) {
  console.error('❌ Error copying index.html to 404.html:', error.message);
  process.exit(1);
}

