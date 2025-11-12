#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { events } from '../data/events.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  appUrl: 'http://localhost:9000', // Vite dev server (configured in app/vite.config.ts)
  viewport: {
    width: 1290,  // iPhone 15 Pro Max width (430px * 3)
    height: 2796, // iPhone 15 Pro Max height (932px * 3)
    deviceScaleFactor: 3,
  },
  screenshotDelay: 1000, // Wait time before taking screenshot
  navigationDelay: 800,  // Wait time after navigation/clicks
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const langArg = args.find(arg => arg.startsWith('--lang='));
  const urlArg = args.find(arg => arg.startsWith('--url='));

  return {
    language: langArg ? langArg.split('=')[1] : 'en-GB',
    appUrl: urlArg ? urlArg.split('=')[1] : CONFIG.appUrl,
  };
}

// Seed database with test events
async function seedDatabase(page, language) {
  console.log(`  📦 Seeding database with ${language} events...`);

  const eventData = events[language] || events['en-GB'];

  await page.evaluate((eventsData) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('EventDB', 3);

      request.onerror = () => reject(request.error);

      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(['eventItems'], 'readwrite');
        const store = tx.objectStore('eventItems');

        // Clear existing data
        store.clear();

        // Add seed data
        eventsData.forEach(event => store.put(event));

        tx.oncomplete = () => {
          console.log(`Seeded ${eventsData.length} events`);
          db.close();
          resolve();
        };

        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('eventItems')) {
          db.createObjectStore('eventItems', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }
      };
    });
  }, eventData);

  console.log(`  ✅ Database seeded with ${eventData.length} events`);
}

// Skip onboarding by setting localStorage
async function skipOnboarding(page) {
  console.log('  ⏭️  Skipping onboarding...');

  // Use evaluateOnNewDocument to set localStorage before page scripts run
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('hasSeenOnboarding', 'true');
  });
}

// Clear app state for fresh start
async function clearAppState(page) {
  console.log('  🧹 Clearing app state...');

  // Navigate to about:blank first to ensure clean context
  await page.goto('about:blank');

  // Set up script to clear storage before any page loads
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  });
}

// Wait for page to be ready
async function waitForPageReady(page) {
  await page.waitForNetworkIdle({ idleTime: 500 });
  await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));
}

// Screenshot flows
async function captureOnboardingFlow(page, language, outputDir) {
  console.log('\n📸 Capturing onboarding flow...');

  // Screen 1: Value Proposition
  await page.waitForSelector('text=/Turn Everything into Calendar Events/i', { timeout: 10000 });
  await page.waitForTimeout(CONFIG.screenshotDelay);
  await page.screenshot({
    path: join(outputDir, '01_onboarding_value_prop.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: Value Proposition');

  // Click Next
  const nextButtons = await page.$$('button');
  for (const btn of nextButtons) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && (text.includes('Next') || text.includes('Weiter'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));

  // Screen 2: How It Works
  await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, '02_onboarding_how_it_works.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: How It Works');

  // Click Next
  const nextButtons2 = await page.$$('button');
  for (const btn of nextButtons2) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && (text.includes('Next') || text.includes('Weiter'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));

  // Screen 3: Tickets Feature
  await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, '03_onboarding_tickets.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: Tickets Feature');

  // Click Next
  const nextButtons3 = await page.$$('button');
  for (const btn of nextButtons3) {
    const text = await btn.evaluate(el => el.textContent);
    if (text && (text.includes('Next') || text.includes('Weiter'))) {
      await btn.click();
      break;
    }
  }
  await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));

  // Screen 4: Get Started / Permissions
  await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, '04_onboarding_permissions.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: Permissions Screen');
}

async function captureHomeScreen(page, language, outputDir) {
  console.log('\n📸 Capturing home screen...');

  await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, '05_home_screen.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: Home Screen');
}

async function captureEventList(page, language, outputDir) {
  console.log('\n📸 Capturing event list...');

  // Open event list/history
  // Try to find and click the "Your Events" or "Your Captures" button
  const buttonSelectors = [
    'text=/Your Events/i',
    'text=/Your Captures/i',
    'text=/Deine Events/i',
    '[data-testid="history-button"]',
    'button:has-text("Your")',
  ];

  let buttonFound = false;
  for (const selector of buttonSelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 2000 });
      await page.click(selector);
      buttonFound = true;
      break;
    } catch (e) {
      continue;
    }
  }

  if (!buttonFound) {
    console.log('  ⚠️  Could not find event list button, skipping event list screenshots');
    return;
  }

  await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));
  await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));

  await page.screenshot({
    path: join(outputDir, '06_event_list.png'),
    fullPage: false
  });
  console.log('  ✓ Captured: Event List');

  // Try to open first event detail
  try {
    // Look for the first event card
    const eventCards = await page.$$('[data-event-id], .event-card, [class*="event"]');
    if (eventCards.length > 0) {
      await eventCards[0].click();
      await new Promise(resolve => setTimeout(resolve, CONFIG.navigationDelay));
      await new Promise(resolve => setTimeout(resolve, CONFIG.screenshotDelay));

      await page.screenshot({
        path: join(outputDir, '07_event_detail.png'),
        fullPage: false
      });
      console.log('  ✓ Captured: Event Detail');
    }
  } catch (e) {
    console.log('  ⚠️  Could not capture event detail:', e.message);
  }
}

// Main function
async function generateScreenshots() {
  const { language, appUrl } = parseArgs();

  console.log('\n🚀 Cap2Cal Screenshot Generator');
  console.log('================================');
  console.log(`Language: ${language}`);
  console.log(`App URL: ${appUrl}`);
  console.log(`Viewport: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @${CONFIG.viewport.deviceScaleFactor}x`);

  // Create output directory
  const outputDir = join(__dirname, '..', 'output', language);
  await mkdir(outputDir, { recursive: true });
  console.log(`Output: ${outputDir}\n`);

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: CONFIG.viewport,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  try {
    const page = await browser.newPage();

    // Configure page
    await page.setViewport(CONFIG.viewport);

    // Set user agent to avoid any bot detection
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

    // ===== ONBOARDING FLOW =====
    console.log('\n📱 Flow 1: Onboarding');
    console.log('─────────────────────');

    await clearAppState(page);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await waitForPageReady(page);

    await captureOnboardingFlow(page, language, outputDir);

    // ===== HOME SCREEN =====
    console.log('\n📱 Flow 2: Home Screen');
    console.log('─────────────────────');

    // Go to about:blank first to reset context
    await page.goto('about:blank');
    await skipOnboarding(page);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await waitForPageReady(page);

    await captureHomeScreen(page, language, outputDir);

    // ===== EVENT LIST =====
    console.log('\n📱 Flow 3: Event List');
    console.log('─────────────────────');

    // Go to about:blank first to reset context
    await page.goto('about:blank');
    await skipOnboarding(page);

    // Now navigate to the app
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Seed database after page is loaded
    await seedDatabase(page, language);

    // Reload to show seeded data
    await page.reload({ waitUntil: 'networkidle2' });
    await waitForPageReady(page);

    await captureEventList(page, language, outputDir);

    console.log('\n✅ Screenshot generation complete!');
    console.log(`📁 Screenshots saved to: ${outputDir}\n`);

  } catch (error) {
    console.error('\n❌ Error generating screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateScreenshots().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateScreenshots };
