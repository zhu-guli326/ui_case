import { mkdir, access, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "assets", "skills", "web");
const force = process.argv.includes("--force");
const catalogSource = await readFile(path.join(root, "src", "features", "skills", "skills.js"), "utf8");
const websiteBlock = catalogSource.slice(
  catalogSource.indexOf("const designReferenceWebsites = ["),
  catalogSource.indexOf("const skillsTranslations = {")
);
const replacementDomains = new Set(
  [...websiteBlock.matchAll(/\{\s*([^\n]+?)\s*\},?/g)].flatMap((match) => {
    const record = match[1];
    const domain = record.match(/domain:\s*"([^"]+)"/)?.[1];
    const replacement = record.match(/(?:previewSrc|previewImage):\s*"([^"]+)"/)?.[1];
    if (!domain || !replacement) return [];
    const canonical = `./assets/skills/web/${filenameFor(domain)}`;
    return replacement === canonical ? [] : [domain];
  })
);

const websites = [
  ["recent.design", "https://recent.design/"],
  ["lapa.ninja", "https://www.lapa.ninja/"],
  ["land-book.com", "https://land-book.com/"],
  ["awwwards.com", "https://www.awwwards.com/sites/michael-gatt"],
  ["mobbin.com", "https://mobbin.com/discover/apps/ios/latest"],
  ["refero.design", "https://refero.design/"],
  ["designspells.com", "https://www.designspells.com/"],
  ["supahero.io", "https://supahero.io/"],
  ["navbar.gallery", "https://www.navbar.gallery/"],
  ["cta.gallery", "https://www.cta.gallery/"],
  ["footer.design", "https://www.footer.design/"],
  ["loadmo.re", "https://loadmo.re/"],
  ["animejs.com", "https://animejs.com/"],
  ["slidify.cn", "https://slidify.cn/"],
];

function filenameFor(domain) {
  return `${domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.jpg`;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  locale: "zh-CN",
});

const failures = [];
for (const [domain, url] of websites) {
  const output = path.join(outputDir, filenameFor(domain));
  if (replacementDomains.has(domain)) {
    if (await exists(output)) {
      await rm(output);
      process.stdout.write(`removed superseded ${domain} screenshot\n`);
    }
    continue;
  }
  if (!force && await exists(output)) {
    process.stdout.write(`skip ${domain}\n`);
    continue;
  }

  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(3_500);
    await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}" }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: output, type: "jpeg", quality: 78, fullPage: false });
    process.stdout.write(`saved ${domain}\n`);
  } catch (error) {
    failures.push(`${domain}: ${error.message}`);
    process.stderr.write(`failed ${domain}\n`);
  } finally {
    await page.close();
  }
}

await context.close();
await browser.close();

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
}
