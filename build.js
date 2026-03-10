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

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
);
const CARD_VERSION = packageJson.version || '0.0.0';

// Аргументы командной строки
const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');
const BUNDLE_BUDGET_KB = 360;

const lazyEntryModules = {
  'uc-lazy-advanced': 'src/lazy/advanced-bundle',
  'uc-lazy-editor': 'src/lazy/editor-bundle',
  'uc-lazy-card-editor': 'src/lazy/card-editor-bundle',
  'uc-lazy-devtools': 'src/lazy/devtools-bundle'
};

function resolveModuleEntry(relPathWithoutExtension) {
  const candidates = [
    `${relPathWithoutExtension}.ts`,
    `${relPathWithoutExtension}.js`
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(__dirname, candidate);
    if (fs.existsSync(absolutePath)) {
      return candidate;
    }
  }

  return null;
}

const entryPoint = resolveModuleEntry('src/index');
const lazyEntries = Object.fromEntries(
  Object.entries(lazyEntryModules).map(([name, relPathWithoutExtension]) => {
    const resolvedEntry = resolveModuleEntry(relPathWithoutExtension);
    return [name, resolvedEntry];
  }).filter(([, resolvedEntry]) => Boolean(resolvedEntry))
);

// Конфигурация
const config = {
  entryPoints: [entryPoint].filter(Boolean),
  bundle: true,
  outfile: 'universal-card.js',
  format: 'iife',
  target: ['es2018'],
  supported: {
    // Отключаем фичи которые Safari 13 не поддерживает
    'optional-chain': false,
    'nullish-coalescing': false,
  },
  minify: !isDev,
  sourcemap: isDev,
  banner: {
    js: `/**
 * Universal Card v${CARD_VERSION}
 * @license MIT
 */`
  },
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
  }
};

const lazyConfig = {
  entryPoints: lazyEntries,
  bundle: true,
  outdir: 'lazy',
  format: 'esm',
  target: ['es2020'],
  minify: !isDev,
  sourcemap: isDev,
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
  }
};

// Проверяем наличие src/index.(ts|js) и lazy entrypoints
if (!entryPoint) {
  console.error('❌ Error: src/index.(ts|js) not found!');
  console.error('   Create src/index.ts with your imports first.');
  process.exit(1);
}

const missingLazyEntries = Object.entries(lazyEntryModules)
  .filter(([name]) => !lazyEntries[name])
  .map(([, relPathWithoutExtension]) => relPathWithoutExtension);

if (missingLazyEntries.length > 0) {
  console.error('❌ Error: missing lazy entry modules:');
  missingLazyEntries.forEach((relPathWithoutExtension) => {
    console.error(`   • ${relPathWithoutExtension}.(ts|js)`);
  });
  process.exit(1);
}

console.log(`📦 Building from ${entryPoint}...`);

// Сборка
async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(config);
      const lazyCtx = await esbuild.context(lazyConfig);
      await ctx.watch();
      await lazyCtx.watch();
      console.log('👀 Watching for changes...');
    } else {
      await esbuild.build(config);
      await esbuild.build(lazyConfig);
      
      // Статистика
      const stats = fs.statSync(config.outfile);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const budgetExceeded = Number(sizeKB) > BUNDLE_BUDGET_KB;
      const lazyStats = Object.keys(lazyEntries).map((name) => {
        const filePath = path.join(__dirname, 'lazy', `${name}.js`);
        const fileSize = fs.existsSync(filePath)
          ? (fs.statSync(filePath).size / 1024).toFixed(2)
          : '0.00';
        return { name: `${name}.js`, sizeKB: fileSize };
      });
      
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║              UNIVERSAL CARD BUILD COMPLETE                 ║');
      console.log('╠════════════════════════════════════════════════════════════╣');
      console.log('║  Output:  universal-card.js                                ║');
      console.log('║  Size:    ' + sizeKB.padEnd(8) + ' KB' + '                                  ║');
      console.log('║  Mode:    ' + (isDev ? 'Development' : 'Production ').padEnd(12) + '                              ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');

      if (!isDev) {
        const mark = budgetExceeded ? '❌' : '✅';
        console.log(`${mark} Bundle budget: ${sizeKB} KB / ${BUNDLE_BUDGET_KB} KB`);
      }

      console.log('📦 Lazy bundles:');
      lazyStats.forEach((item) => {
        console.log(`   • ${item.name}: ${item.sizeKB} KB`);
      });
      
      // Копируем в www если production
      if (!isDev) {
        const wwwPath = path.join(__dirname, '..', '..', 'www', 'universal-card.js');
        const wwwLazyDir = path.join(__dirname, '..', '..', 'www', 'lazy');
        try {
          fs.copyFileSync(config.outfile, wwwPath);
          fs.mkdirSync(wwwLazyDir, { recursive: true });
          Object.keys(lazyEntries).forEach((name) => {
            const from = path.join(__dirname, 'lazy', `${name}.js`);
            const to = path.join(wwwLazyDir, `${name}.js`);
            if (fs.existsSync(from)) {
              fs.copyFileSync(from, to);
            }
          });
          console.log('📦 Copied to www/universal-card.js');
          console.log('📦 Copied lazy bundles to www/lazy/');
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
