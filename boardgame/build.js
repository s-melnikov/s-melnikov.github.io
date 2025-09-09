#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';
const GAME_NAME = 'test-game';

class GameBuilder {
  constructor() {
    this.projectRoot = __dirname;
    this.outputDir = path.join(this.projectRoot, 'dist');
    this.assetsDir = path.join(this.projectRoot, 'images');
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
      return null;
    }
  }

  inlineCSS(html, cssPath) {
    const css = this.readFile(cssPath);
    if (!css) return html;
    
    return html.replace(
      '<link rel="stylesheet" href="./styles.css">',
      `<style>${css}</style>`
    );
  }

  inlineJS(html, jsPath) {
    const js = this.readFile(jsPath);
    if (!js) return html;
    
    return html.replace(
      `<script src="${jsPath}"></script>`,
      `<script>${js}</script>`
    );
  }

  async embedImages(html) {
    const imagesDir = this.assetsDir;
    if (!fs.existsSync(imagesDir)) {
      console.warn('Images directory not found, skipping image embedding');
      return html;
    }

    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file));

    for (const imageFile of imageFiles) {
      try {
        const imagePath = path.join(imagesDir, imageFile);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64 = imageBuffer.toString('base64');
        const ext = path.extname(imageFile).toLowerCase();
        const mimeType = ext === '.webp' ? 'image/webp' : 
                        ext === '.png' ? 'image/png' :
                        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                        ext === '.gif' ? 'image/gif' : 'image/png';
        
        const dataUrl = `data:${mimeType};base64,${base64}`;
        
        const imageName = path.basename(imageFile);
        const regex = new RegExp(`url\\(./images/${imageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
        html = html.replace(regex, `url(${dataUrl})`);
        
        console.log(`✓ Embedded image: ${imageName}`);
      } catch (error) {
        console.error(`Error embedding image ${imageFile}:`, error.message);
      }
    }

    return html;
  }
  
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async build() {
    console.log('🚀 Starting build process...');
    
    this.ensureDir(this.outputDir);

    const htmlPath = path.join(this.projectRoot, 'index.html');
    let html = this.readFile(htmlPath);
    
    if (!html) {
      console.error('❌ Failed to read index.html');
      process.exit(1);
    }

    console.log('📄 Processing HTML...');

    html = this.inlineCSS(html, path.join(this.projectRoot, 'styles.css'));
    console.log('✓ Inlined CSS');

    const jsFiles = ['config.js', 'tabletop.js', 'assets.js', 'game.js'];
    for (const jsFile of jsFiles) {
      html = this.inlineJS(html, `./${jsFile}`);
      console.log(`✓ Inlined ${jsFile}`);
    }

    console.log('🖼️  Embedding images...');
    html = await this.embedImages(html);

    const buildInfo = `
<!-- 
  Built with GameBuilder v${VERSION}
  Build time: ${new Date().toISOString()}
  Game: ${GAME_NAME}
-->
`;

    html = html.replace('<head>', `<head>${buildInfo}`);

    const outputFileName = `${GAME_NAME}.${VERSION}.html`;
    const outputPath = path.join(this.outputDir, outputFileName);
    
    fs.writeFileSync(outputPath, html, 'utf8');
    
    const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
    
    console.log(`✅ Build completed successfully!`);
    console.log(`📦 Output: ${outputPath}`);
    console.log(`📊 File size: ${fileSize} MB`);
    console.log(`🎮 Game: ${GAME_NAME} v${VERSION}`);
  }
}

if (require.main === module) {
  const builder = new GameBuilder();
  builder.build().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });
}

module.exports = GameBuilder;
