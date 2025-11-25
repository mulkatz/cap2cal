#!/usr/bin/env node

import puppeteer from "puppeteer";
import { events } from "../data/events.js";
import {
  exampleImage1,
  exampleImage2,
  exampleImage3,
  exampleImage,
} from "../data/example-image.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdir } from "fs/promises";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  appUrl: "http://localhost:9000", // Vite dev server (configured in app/vite.config.ts)
  viewport: {
    // width: 1290,  // iPhone 15 Pro Max width (430px * 3)
    // height: 2796, // iPhone 15 Pro Max height (932px * 3)
    width: 414, // iPhone 15 Pro Max width (430px * 3)
    height: 520, // iPhone 15 Pro Max height (932px * 3)
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

// Seed database with test events and images
async function seedDatabase(page, language) {
  console.log(`  📦 Seeding database with ${language} events...`);

  const eventData = events[language] || events["en-GB"];

  // Add image reference to first event
  const eventsWithImages = eventData.map((event, index) => {
    if (index === 0) {
      return { ...event, img: "example-001" };
    }
    return event;
  });

  await page.evaluate(
    ({ eventsData, imageData }) => {
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

          const tx = db.transaction(["eventItems", "images"], "readwrite");
          const eventStore = tx.objectStore("eventItems");
          const imageStore = tx.objectStore("images");

          // Clear existing data
          eventStore.clear();
          imageStore.clear();

          // Add seed data
          eventsData.forEach((event) => eventStore.put(event));

          // Add example image
          imageStore.put(imageData);

          tx.oncomplete = () => {
            console.log(`Seeded ${eventsData.length} events and 1 image`);
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
    },
    { eventsData: eventsWithImages, imageData: exampleImage },
  );

  console.log(
    `  ✅ Database seeded with ${eventData.length} events and 1 image`,
  );
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

async function captureCaptureFlow(
  page,
  language,
  outputDir,
  exampleNumber = 1,
) {
  console.log(
    `\n📸 Capturing photo capture flow (Example ${exampleNumber})...`,
  );

  // Select the correct example image based on exampleNumber
  const exampleImages = {
    1: exampleImage1,
    2: exampleImage2,
    3: exampleImage3,
  };
  const currentExampleImage = exampleImages[exampleNumber];

  // Screenshot mode is already set up in main flow with example image in localStorage
  // Step 1: Navigate and wait for camera view to initialize
  try {
    // Click capture button to open camera
    const captureButton = await page.waitForSelector(
      '[data-testid="capture-button"]',
      {
        visible: true,
        timeout: 5000,
      },
    );

    if (!captureButton) {
      console.log("  ⚠️  Could not find capture button");
      return;
    }

    await captureButton.click();
    await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));

    // Check for camera instruction dialog (appears on first launch)
    console.log("  ⏳ Checking for camera instruction dialog...");
    try {
      // Wait longer for the dialog to appear
      const instructionDialog = await page.waitForSelector(
        '[data-testid="camera-instruction-dialog"]',
        {
          visible: true,
          timeout: 5000,
        },
      );

      if (instructionDialog) {
        console.log(
          "  ℹ️  Camera instruction dialog detected, looking for 'Got it' button...",
        );

        // Wait a moment for the button to be ready
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find the button within the dialog (it's a highlight-colored button)
        const confirmButton = await page.evaluateHandle(() => {
          const dialog = document.querySelector(
            '[data-testid="camera-instruction-dialog"]',
          );
          if (dialog) {
            // Find the button with highlight background color
            return dialog.querySelector("button.bg-highlight");
          }
          return null;
        });

        if (confirmButton) {
          console.log("  👆 Clicking 'Got it' button...");
          await confirmButton.click();
          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.navigationDelay * 2),
          );
          console.log("  ✓ Closed camera instruction dialog");
        } else {
          console.log("  ⚠️  Button not found within dialog");
        }
      }
    } catch (e) {
      console.log(
        "  ℹ️  No camera instruction dialog found (error: " + e.message + ")",
      );
    }

    // Wait for camera view to appear
    await page
      .waitForSelector('[data-camera-view="true"]', {
        timeout: 5000,
      })
      .catch(() => {
        console.log("  ⚠️  Camera view not found, continuing anyway...");
      });

    // Wait for camera to initialize and preview to start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("  ⏳ Waiting for camera preview to start...");

    // Step 2: Inject the example image as camera background overlay
    await page.evaluate((imageDataUrl) => {
      // Remove any existing overlay first
      const existingOverlay = document.querySelector(
        '[data-screenshot-camera-bg="true"]',
      );
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Find camera container
      const cameraContainer =
        document.querySelector('[data-camera-view="true"]') ||
        document.querySelector(".camera-view") ||
        document.body;

      // Create image overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-image: url('${imageDataUrl}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      `;
      overlay.setAttribute("data-screenshot-camera-bg", "true");

      if (cameraContainer === document.body) {
        document.body.insertBefore(overlay, document.body.firstChild);
      } else {
        cameraContainer.appendChild(overlay);
      }
    }, currentExampleImage.dataUrl);

    await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));

    // Screenshot the camera view for each example
    const cameraScreenshotMap = {
      1: "03_camera_view_1.png",
      2: "03a_camera_view_2.png",
      3: "03b_camera_view_3.png",
    };

    await page.screenshot({
      path: join(outputDir, cameraScreenshotMap[exampleNumber]),
      fullPage: false,
    });
    console.log(
      `  ✓ Captured: Camera View with Example Image ${exampleNumber}`,
    );

    // Step 3: Click capture to trigger the flow
    await page
      .waitForSelector('[data-testid="camera-capture-button"]', {
        visible: true,
        timeout: 10000,
      })
      .catch(() => {
        console.log("  ⚠️  Camera capture button not visible");
      });

    // Trigger capture (this will use our mocked camera that returns the example image)
    const captureShutterButton = await page.$(
      '[data-testid="camera-capture-button"]',
    );

    if (captureShutterButton) {
      await captureShutterButton.click();
      console.log(
        "  ⏳ Triggered capture - screenshot mode will use example image",
      );

      // Remove the camera background overlay immediately after capture
      await page.evaluate(() => {
        const overlay = document.querySelector(
          '[data-screenshot-camera-bg="true"]',
        );
        if (overlay) {
          overlay.remove();
          console.log("📸 Removed camera background overlay");
        }
      });

      // Step 4: Wait for loading dialog to appear and capture it (only for first example)
      if (exampleNumber === 1) {
        console.log("  ⏳ Waiting for loading dialog to appear...");
        try {
          await page.waitForSelector('[data-testid="loading-dialog"]', {
            visible: true,
            timeout: 5000,
          });
          console.log("  ✓ Loading dialog appeared");

          // Wait a bit to ensure dialog is fully rendered
          await new Promise((resolve) => setTimeout(resolve, 500));

          await page.screenshot({
            path: join(outputDir, "04_capture_loading.png"),
            fullPage: false,
          });
          console.log("  ✓ Captured: Loading Dialog");
        } catch (e) {
          console.log("  ⚠️  Loading dialog not visible, skipping screenshot");
        }
      } else {
        // For subsequent captures, just wait for the loading to start
        console.log("  ⏳ Waiting for loading to complete...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Step 5: Wait for result dialog to appear and capture it
      console.log("  ⏳ Waiting for result dialog to appear...");
      try {
        await page.waitForSelector('[data-testid="result-dialog"]', {
          visible: true,
          timeout: 30000,
        });
        console.log("  ✓ Result dialog appeared");

        // Wait a bit to ensure dialog is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Screenshot result dialog for each example
        const screenshotMap = {
          1: "04a_capture_result_1.png",
          2: "04b_capture_result_2.png",
          3: "04c_capture_result_3.png",
        };

        await page.screenshot({
          path: join(outputDir, screenshotMap[exampleNumber]),
          fullPage: false,
        });
        console.log(`  ✓ Captured: Result Dialog (Example ${exampleNumber})`);

        // Close the result dialog to continue
        console.log("  🔘 Closing result dialog...");
        await page
          .click(
            '[data-testid="result-close-button"], button[aria-label="Close"]',
          )
          .catch(() => {
            console.log("  ⚠️  Close button not found");
          });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.log("  ⚠️  Result dialog not visible within timeout");
      }
    } else {
      console.log("  ⚠️  Could not find camera capture button");
    }
  } catch (error) {
    console.log(`  ⚠️  Error in capture flow: ${error.message}`);
  }
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

async function captureSettingsScreen(page, language, outputDir) {
  console.log("\n📸 Capturing settings screen...");

  // Go back to home first if we're in event history
  await page.goto("about:blank");
  await skipOnboarding(page);
  await page.goto(`${CONFIG.appUrl}?lng=${language}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Click settings button
  try {
    await page.waitForSelector('[data-testid="settings-button"]', {
      visible: true,
      timeout: 5000,
    });
    await page.click('[data-testid="settings-button"]');
    await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));
    await new Promise((resolve) => setTimeout(resolve, CONFIG.screenshotDelay));

    await page.screenshot({
      path: join(outputDir, "08_settings.png"),
      fullPage: false,
    });
    console.log("  ✓ Captured: Settings Screen");
  } catch (e) {
    console.log("  ⚠️  Could not capture settings screen:", e.message);
  }
}

async function captureImagePreview(page, language, outputDir) {
  console.log("\n📸 Capturing image preview...");

  // Navigate to event list with seeded data
  await page.goto("about:blank");
  await skipOnboarding(page);
  await page.goto(`${CONFIG.appUrl}?lng=${language}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await seedDatabase(page, language);
  await page.reload({ waitUntil: "domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Open event history
  try {
    await page.waitForSelector('[data-testid="history-button"]', {
      visible: true,
      timeout: 5000,
    });
    await page.click('[data-testid="history-button"]');
    await new Promise((resolve) => setTimeout(resolve, CONFIG.navigationDelay));

    // Click on first event to open detail
    const eventCards = await page.$$(
      '[data-event-id], .event-card, [class*="event"]',
    );
    if (eventCards.length > 0) {
      await eventCards[0].click();
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.navigationDelay),
      );

      // Look for image/camera icon and click it (matches any event-image-icon-*)
      await new Promise((resolve) => setTimeout(resolve, 500));
      const imageIcons = await page.$$('[data-testid^="event-image-icon-"]');
      if (imageIcons.length > 0) {
        console.log(
          `  ℹ️  Found ${imageIcons.length} event image icons, clicking the first one`,
        );
        await imageIcons[0].click();
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.navigationDelay),
        );
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.screenshotDelay),
        );

        await page.screenshot({
          path: join(outputDir, "10_image_preview.png"),
          fullPage: false,
        });
        console.log("  ✓ Captured: Image Preview");
      }
    }
  } catch (e) {
    console.log("  ⚠️  Could not capture image preview:", e.message);
  }
}

async function captureUpgradeDialog(page, language, outputDir) {
  console.log("\n📸 Capturing upgrade dialog...");

  // Go back to home
  await page.goto("about:blank");
  await skipOnboarding(page);
  await page.goto(`${CONFIG.appUrl}?lng=${language}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Trigger upgrade dialog by simulating reaching the free tier limit
  try {
    // Set the event count to trigger paywall
    await page.evaluate(() => {
      localStorage.setItem("eventCount", "10"); // Assuming 10 is the free tier limit
    });

    // Try to trigger capture flow which should show paywall
    const captureButton = await page.$('[data-testid="capture-button"]');
    if (captureButton) {
      await captureButton.click();
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.navigationDelay),
      );
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.screenshotDelay),
      );

      // Check if upgrade dialog is visible
      const upgradeDialog = await page.$('[data-testid="upgrade-dialog"]');
      if (upgradeDialog) {
        await page.screenshot({
          path: join(outputDir, "11_upgrade_dialog.png"),
          fullPage: false,
        });
        console.log("  ✓ Captured: Upgrade Dialog");
      }
    }
  } catch (e) {
    console.log("  ⚠️  Could not capture upgrade dialog:", e.message);
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

    // Grant camera and microphone permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(appUrl, ["camera", "microphone"]);
    console.log("  ✓ Granted camera permissions");

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

    // Helper function to set up screenshot mode
    const setupScreenshotMode = async (exampleNumber) => {
      await page.evaluateOnNewDocument((num) => {
        localStorage.setItem("hasSeenOnboarding", "true");
        localStorage.setItem("hasSeenCameraInstruction", "true");
        localStorage.setItem("__SCREENSHOT_MODE__", "true");
        localStorage.setItem("__SCREENSHOT_EXAMPLE_NUMBER__", num);
        console.log(
          `📸 Screenshot mode enabled - will use example image ${num}`,
        );
      }, exampleNumber.toString());
    };

    // ===== CAPTURE FLOW 1 =====
    console.log("\n📱 Flow 3: Camera & Capture (Example 1)");
    console.log("─────────────────────────────────────");

    await setupScreenshotMode(1);
    await page.goto(`${appUrl}?lng=${language}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await captureCaptureFlow(page, language, outputDir, 1);

    // Navigate to event history after capture
    console.log("  📋 Navigating to event history...");
    await page.click('[data-testid="history-button"]');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.screenshot({
      path: join(outputDir, "05_event_history_after_capture_1.png"),
      fullPage: false,
    });
    console.log("  ✓ Captured: Event History (After Capture 1)");

    // Open image preview for first capture
    console.log("  🖼️  Opening image preview for capture 1...");
    try {
      // Wait a bit more for event cards to fully render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Debug: Check what testids are present on the page
      const allTestIds = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("[data-testid]"));
        return elements.map((el) => el.getAttribute("data-testid"));
      });
      const eventTestIds = allTestIds.filter(
        (id) => id && id.includes("event"),
      );
      console.log(
        `  🐛 Debug: All testids found (${allTestIds.length} total):`,
        allTestIds.slice(0, 20),
      );
      console.log(`  🐛 Debug: Event-related testids:`, eventTestIds);

      // Find all event image icon buttons and click the first one (most recent event)
      const imageIcons = await page.$$('[data-testid^="event-image-icon-"]');
      if (imageIcons.length === 0) {
        throw new Error("No event image icons found");
      }
      console.log(
        `  ℹ️  Found ${imageIcons.length} event image icons, clicking the first one`,
      );
      await imageIcons[0].click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await page.screenshot({
        path: join(outputDir, "05a_image_preview_1.png"),
        fullPage: false,
      });
      console.log("  ✓ Captured: Image Preview 1");

      // Close image preview using back button
      await page.click('button[aria-label="Go back"]');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      console.log("  ⚠️  Could not capture image preview 1:", e.message);
    }

    // ===== CAPTURE FLOW 2 =====
    console.log("\n📱 Flow 4: Capture (Example 2)");
    console.log("───────────────────────────────");

    // Go back home
    await page
      .click(
        '[data-testid="close-history-button"], .back-button, button[aria-label="Close"]',
      )
      .catch(() => {
        console.log("  ⚠️  Back button not found, navigating directly");
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await setupScreenshotMode(2);
    await page.reload({ waitUntil: "domcontentloaded" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await captureCaptureFlow(page, language, outputDir, 2);

    // Navigate to event history
    console.log("  📋 Navigating to event history...");
    await page.click('[data-testid="history-button"]');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.screenshot({
      path: join(outputDir, "06_event_history_after_capture_2.png"),
      fullPage: false,
    });
    console.log("  ✓ Captured: Event History (After Capture 2)");

    // Open image preview for second capture
    console.log("  🖼️  Opening image preview for capture 2...");
    try {
      // Wait a bit more for event cards to fully render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Debug: Check what testids are present on the page
      const allTestIds = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll("[data-testid]"));
        return elements.map((el) => el.getAttribute("data-testid"));
      });
      const eventTestIds = allTestIds.filter(
        (id) => id && id.includes("event"),
      );
      console.log(
        `  🐛 Debug: All testids found (${allTestIds.length} total):`,
        allTestIds.slice(0, 20),
      );
      console.log(`  🐛 Debug: Event-related testids:`, eventTestIds);

      // Find all event image icon buttons and click the first one (most recent event)
      const imageIcons = await page.$$('[data-testid^="event-image-icon-"]');
      if (imageIcons.length === 0) {
        throw new Error("No event image icons found");
      }
      console.log(
        `  ℹ️  Found ${imageIcons.length} event image icons, clicking the first one`,
      );
      await imageIcons[0].click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await page.screenshot({
        path: join(outputDir, "06a_image_preview_2.png"),
        fullPage: false,
      });
      console.log("  ✓ Captured: Image Preview 2");

      // Close image preview using back button
      await page.click('button[aria-label="Go back"]');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      console.log("  ⚠️  Could not capture image preview 2:", e.message);
    }

    // ===== CAPTURE FLOW 3 =====
    console.log("\n📱 Flow 5: Capture (Example 3)");
    console.log("───────────────────────────────");

    // Go back home
    await page
      .click(
        '[data-testid="close-history-button"], .back-button, button[aria-label="Close"]',
      )
      .catch(() => {
        console.log("  ⚠️  Back button not found, navigating directly");
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await setupScreenshotMode(3);
    await page.reload({ waitUntil: "domcontentloaded" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await captureCaptureFlow(page, language, outputDir, 3);

    // Navigate to event history
    console.log("  📋 Navigating to event history...");
    await page.click('[data-testid="history-button"]');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.screenshot({
      path: join(outputDir, "07_event_history_final.png"),
      fullPage: false,
    });
    console.log("  ✓ Captured: Event History (Final - All 3 Events)");

    // Open image preview for third capture
    console.log("  🖼️  Opening image preview for capture 3...");
    try {
      // Wait a bit more for event cards to fully render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find all event image icon buttons and click the first one (most recent event)
      const imageIcons = await page.$$('[data-testid^="event-image-icon-"]');
      if (imageIcons.length === 0) {
        throw new Error("No event image icons found");
      }
      console.log(
        `  ℹ️  Found ${imageIcons.length} event image icons, clicking the first one`,
      );
      await imageIcons[0].click();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await page.screenshot({
        path: join(outputDir, "07a_image_preview_3.png"),
        fullPage: false,
      });
      console.log("  ✓ Captured: Image Preview 3");

      // Close image preview using back button
      await page.click('button[aria-label="Go back"]');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      console.log("  ⚠️  Could not capture image preview 3:", e.message);
    }

    // ===== SETTINGS SCREEN =====
    console.log("\n📱 Flow 6: Settings");
    console.log("───────────────────");
    await captureSettingsScreen(page, language, outputDir);

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
