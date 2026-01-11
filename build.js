#!/usr/bin/env node
/**
 * Universal Card - Build Script
 * 
 * Собирает все модули в один файл universal-card.js
 * 
 * Использование:
 *   npm run build       - Продакшн сборка (минифицирована)
 *   npm run dev         - Девелопмент сборка (readable)
 *   npm run watch       - Автоматическая пересборка при изменениях
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Аргументы командной строки
const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');

// Конфигурация
const config = {
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'universal-card.js',
  format: 'iife',
  target: ['es2020', 'safari14'],
  minify: !isDev,
  sourcemap: isDev,
  banner: {
    js: `/**
 * Universal Card v1.0.0
 * Advanced Lovelace card for Home Assistant
 * 
 * @author Mesteriis
 * @license MIT
 * @see https://github.com/Mesteriis/universal-card
 * 
 * Built: ${new Date().toISOString()}
 */`
  },
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
  }
};

// Проверяем наличие src/index.js
const srcDir = path.join(__dirname, 'src');
const srcIndex = path.join(srcDir, 'index.js');

if (!fs.existsSync(srcIndex)) {
  console.error('❌ Error: src/index.js not found!');
  console.error('   Create src/index.js with your imports first.');
  process.exit(1);
}

console.log('📦 Building from src/index.js...');

// Сборка
async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      const result = await esbuild.build(config);
      
      // Статистика
      const stats = fs.statSync(config.outfile);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║              UNIVERSAL CARD BUILD COMPLETE                 ║');
      console.log('╠════════════════════════════════════════════════════════════╣');
      console.log('║  Output:  universal-card.js                                ║');
      console.log('║  Size:    ' + sizeKB.padEnd(8) + ' KB' + '                                  ║');
      console.log('║  Mode:    ' + (isDev ? 'Development' : 'Production ').padEnd(12) + '                              ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');
      
      // Копируем в www если production
      if (!isDev) {
        const wwwPath = path.join(__dirname, '..', '..', 'www', 'universal-card.js');
        try {
          fs.copyFileSync(config.outfile, wwwPath);
          console.log('📦 Copied to www/universal-card.js');
        } catch (e) {
          console.log('⚠️  Could not copy to www/ (path may not exist)');
        }
      }
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
