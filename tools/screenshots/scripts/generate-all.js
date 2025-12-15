#!/usr/bin/env node

import { generateScreenshots } from './generate-screenshots.js';

const LANGUAGES = ['en-GB', 'de-DE', 'es-ES', 'fr-FR', 'pt-BR'];

async function generateAllScreenshots() {
  console.log('\n🌍 Generating screenshots for all languages');
  console.log('==========================================\n');

  for (const language of LANGUAGES) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Starting ${language}...`);
    console.log('='.repeat(50));

    // Temporarily override process.argv to pass language argument
    const originalArgv = process.argv.slice();
    process.argv = [process.argv[0], process.argv[1], `--lang=${language}`];

    try {
      await generateScreenshots();
      console.log(`\n✅ Completed ${language}`);
    } catch (error) {
      console.error(`\n❌ Failed for ${language}:`, error.message);
      process.argv = originalArgv;
      process.exit(1);
    }

    process.argv = originalArgv;

    // Wait a bit between languages
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 All screenshots generated successfully!');
  console.log('='.repeat(50) + '\n');
}

generateAllScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
