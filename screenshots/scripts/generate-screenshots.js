#!/usr/bin/env node

import puppeteer from "puppeteer";
import { events } from "../data/events.js";
import { dummyPoster } from "../data/dummy-poster.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdir } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  appUrl: "http://localhost:9000", // Vite dev server (configured in app/vite.config.ts)
  viewport: {
    // width: 1290,  // iPhone 15 Pro Max width (430px * 3)
    // height: 2796, // iPhone 15 Pro Max height (932px * 3)
    width: 430, // iPhone 15 Pro Max width (430px * 3)
    height: 932, // iPhone 15 Pro Max height (932px * 3)
    deviceScaleFactor: 3,
  },
  screenshotDelay: 1000, // Wait time before taking screenshot
  navigationDelay: 800, // Wait time after navigation/clicks
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const langArg = args.find((arg) => arg.startsWith("--lang="));
  const urlArg = args.find((arg) => arg.startsWith("--url="));

  return {
    language: langArg ? langArg.split("=")[1] : "en-GB",
    appUrl: urlArg ? urlArg.split("=")[1] : CONFIG.appUrl,
  };
}

// Seed database with test events
async function seedDatabase(page, language) {
  console.log(`  📦 Seeding database with ${language} events...`);

  const eventData = events[language] || events["en-GB"];

  await page.evaluate((eventsData) => {
    return new Promise((resolve, reject) => {
      // Open database without specifying version - use whatever version exists
      const request = indexedDB.open("EventDB");

      request.onerror = () => reject(request.error);

      request.onsuccess = (e) => {
        const db = e.target.result;

        // Check if the eventItems store exists
        if (!db.objectStoreNames.contains("eventItems")) {
          db.close();
          reject(new Error("eventItems store does not exist"));
          return;
        }

        const tx = db.transaction(["eventItems"], "readwrite");
        const store = tx.objectStore("eventItems");

        // Clear existing data
        store.clear();

        // Add seed data
        eventsData.forEach((event) => store.put(event));

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
        // This shouldn't happen since the app already created the DB
        // But handle it just in case
        const db = e.target.result;
        if (!db.objectStoreNames.contains("eventItems")) {
          db.createObjectStore("eventItems", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id" });
        }
      };
    });
  }, eventData);

  console.log(`  ✅ Database seeded with ${eventData.length} events`);
}

// Skip onboarding by setting localStorage
async function skipOnboarding(page) {
  console.log("  ⏭️  Skipping onboarding...");

  // Use evaluateOnNewDocument to set localStorage before page scripts run
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("hasSeenOnboarding", "true");
  });
}

// Clear app state for fresh start
async function clearAppState(page) {
  console.log("  🧹 Clearing app state...");

  // Navigate to about:blank first to ensure clean context
  await page.goto("about:blank");

  // Set up script to clear storage before any page loads
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
  });
}

// Wait for page to be ready
async function waitForPageReady(page) {
  await page.waitForNetworkIdle({ idleTime: 500 });
  await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));
}

// Screenshot flows
async function captureOnboardingFlow(page, language, outputDir) {
  console.log("\n📸 Capturing onboarding flow...");

  // Wait for onboarding container to be ready
  await page.waitForSelector('[data-testid="onboarding-container"]', {
    timeout: 10000,
  });

  // Screen 1: Value Proposition
  await page.waitForSelector('[data-testid="onboarding-slide-0"]', {
    timeout: 10000,
  });
  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "01_onboarding_value_prop.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Value Proposition");

  // Click Next
  await page.click('[data-testid="onboarding-next-button"]');
  await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));

  // Screen 2: How It Works
  await page.waitForSelector('[data-testid="onboarding-slide-1"]', {
    visible: true,
    timeout: 5000,
  });
  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "02_onboarding_how_it_works.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: How It Works");

  // Click Next
  await page.click('[data-testid="onboarding-next-button"]');
  await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));

  // Screen 3: Get Started / Permissions
  await page.waitForSelector('[data-testid="onboarding-slide-2"]', {
    visible: true,
    timeout: 5000,
  });
  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "03_onboarding_permissions.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Permissions Screen");
}

async function captureHomeScreen(page, language, outputDir) {
  console.log("\n📸 Capturing home screen...");

  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "04_home_screen.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Home Screen");
}

async function captureCaptureFlow(page, language, outputDir) {
  console.log("\n📸 Capturing photo capture flow...");

  const mockEvent = (events[language] || events["en-GB"])[0]; // Use first event from seed data

  // Step 1: Create and screenshot loading state
  await page.evaluate(() => {
    const loadingHtml = `
      <div class="fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6 magicpattern">
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex flex-col items-center text-center bg-primaryDark rounded-lg p-8 max-w-md">
            <div class="mb-3 flex w-full flex-col items-center text-center" data-testid="loading-dialog">
              <svg class="mt-5" width="120" height="120" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#19D8E0">
                <g fill="none" fill-rule="evenodd" stroke-width="2">
                  <circle cx="22" cy="22" r="1">
                    <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                  </circle>
                  <circle cx="22" cy="22" r="1">
                    <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>
              <div class="mx-4 flex h-[100px] w-full flex-col items-center justify-center px-8">
                <span class="w-full text-[16px] text-white">Just a moment, gathering all the details...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
  });

  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "07_capture_loading.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Loading State");

  // Step 2: Replace with result state
  await page.evaluate((eventData) => {
    // Remove loading
    const loadingEl = document.querySelector('[data-testid="loading-dialog"]')?.closest('.fixed');
    if (loadingEl) loadingEl.remove();

    // Create result dialog
    const resultHtml = `
      <div data-testid="result-dialog" class="fixed inset-0 z-50 flex max-h-screen items-center justify-center p-6 magicpattern">
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20"></div>
        <div class="absolute inset-0 flex h-full flex-col">
          <div class="my-auto px-6">
            <div class="bg-primaryDark rounded-xl p-6 shadow-2xl max-w-md mx-auto border border-white/10">
              <div class="mb-2 flex items-start justify-between">
                <span class="inline-block px-3 py-1 bg-highlight/20 text-highlight text-xs font-semibold rounded-full">${eventData.kind || 'Event'}</span>
              </div>
              <h2 class="text-2xl font-bold text-white mb-4 leading-tight">${eventData.title}</h2>
              <div class="text-secondary space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-xl">📅</span>
                  <div>
                    <div class="font-semibold text-white">${eventData.dateTimeFrom.date}</div>
                    <div class="text-sm opacity-80">${eventData.dateTimeFrom.time || ''}</div>
                  </div>
                </div>
                ${eventData.location?.city ? `
                <div class="flex items-start gap-3">
                  <span class="text-xl">📍</span>
                  <div>
                    <div class="font-semibold text-white">${eventData.location.city}</div>
                    ${eventData.location.address ? `<div class="text-sm opacity-80">${eventData.location.address}</div>` : ''}
                  </div>
                </div>
                ` : ''}
                ${eventData.description?.short ? `
                <div class="flex items-start gap-3">
                  <span class="text-xl">ℹ️</span>
                  <p class="text-sm opacity-90 leading-relaxed">${eventData.description.short}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
          <div class="flex w-full items-center justify-center self-end px-4 pb-16">
            <div data-testid="result-close-button" class="rounded-full border-2 border-accentElevated bg-primaryDark p-4 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', resultHtml);
  }, mockEvent);

  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));
  await page.screenshot({
    path: join(outputDir, "08_capture_result.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Result State");
}

async function captureEventList(page, language, outputDir) {
  console.log("\n📸 Capturing event list...");

  // Wait for and click the history button
  try {
    await page.waitForSelector('[data-testid="history-button"]', {
      visible: true,
      timeout: 5000,
    });
    await page.click('[data-testid="history-button"]');
  } catch (e) {
    console.log(
      "  ⚠️  Could not find history button, skipping event list screenshots",
    );
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));
  await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));

  await page.screenshot({
    path: join(outputDir, "05_event_list.png"),
    fullPage: false,
  });
  console.log("  ✓ Captured: Event List");

  // Try to open first event detail
  try {
    // Look for the first event card
    const eventCards = await page.$$(
      '[data-event-id], .event-card, [class*="event"]',
    );
    if (eventCards.length > 0) {
      await eventCards[0].click();
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.navigationDelay),
      );
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.screenshotDelay),
      );

      await page.screenshot({
        path: join(outputDir, "06_event_detail.png"),
        fullPage: false,
      });
      console.log("  ✓ Captured: Event Detail");
    }
  } catch (e) {
    console.log("  ⚠️  Could not capture event detail:", e.message);
  }
}

// Main function
async function generateScreenshots() {
  const { language, appUrl } = parseArgs();

  console.log("\n🚀 Cap2Cal Screenshot Generator");
  console.log("================================");
  console.log(`Language: ${language}`);
  console.log(`App URL: ${appUrl}`);
  console.log(
    `Viewport: ${CONFIG.viewport.width}x${CONFIG.viewport.height} @${CONFIG.viewport.deviceScaleFactor}x`,
  );

  // Create output directory
  const outputDir = join(__dirname, "..", "output", language);
  await mkdir(outputDir, { recursive: true });
  console.log(`Output: ${outputDir}\n`);

  // Launch browser
  console.log("🌐 Launching browser...");
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD
    defaultViewport: CONFIG.viewport,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });

  try {
    const page = await browser.newPage();

    // Configure page
    await page.setViewport(CONFIG.viewport);

    // Set user agent to avoid any bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    );

    // ===== ONBOARDING FLOW =====
    console.log("\n📱 Flow 1: Onboarding");
    console.log("─────────────────────");

    await clearAppState(page);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await waitForPageReady(page);

    await captureOnboardingFlow(page, language, outputDir);

    // ===== HOME SCREEN =====
    console.log("\n📱 Flow 2: Home Screen");
    console.log("─────────────────────");

    // Go to about:blank first to reset context
    await page.goto("about:blank");
    await skipOnboarding(page);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    await waitForPageReady(page);

    await captureHomeScreen(page, language, outputDir);

    // ===== EVENT LIST =====
    console.log("\n📱 Flow 3: Event List");
    console.log("─────────────────────");

    // Go to about:blank first to reset context
    await page.goto("about:blank");
    await skipOnboarding(page);

    // Now navigate to the app
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for app to initialize
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Seed database after page is loaded
    await seedDatabase(page, language);

    // Reload to show seeded data - use domcontentloaded instead of networkidle2
    await page.reload({ waitUntil: "domcontentloaded" });

    // Give the app time to render with seeded data
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await captureEventList(page, language, outputDir);

    // ===== CAPTURE FLOW =====
    console.log("\n📱 Flow 4: Photo Capture");
    console.log("─────────────────────");

    // Go back to home for capture flow
    await page.goto("about:blank");
    await skipOnboarding(page);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await captureCaptureFlow(page, language, outputDir);

    console.log("\n✅ Screenshot generation complete!");
    console.log(`📁 Screenshots saved to: ${outputDir}\n`);
  } catch (error) {
    console.error("\n❌ Error generating screenshots:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateScreenshots().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { generateScreenshots };
