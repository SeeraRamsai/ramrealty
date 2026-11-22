import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const propertyPages = [
  "dist/a-square-maple-woods/index.html",
  "dist/mvv-gv-grand/index.html",
  "dist/utkarsha-capital-towers/index.html",
  "dist/vaisakhi-west-winds/index.html",
];
const visitPages = [
  "dist/site-visit.html",
  "dist/site-visit-confirmation.html",
  "dist/site-visits-admin.html",
];

function assertInlineStylesMatchAsset(pagePath, assetPath) {
  const page = readFileSync(pagePath, "utf8");
  const asset = readFileSync(assetPath, "utf8").trim();
  const assetName = assetPath.split("/").at(-1);
  const escapedAssetName = assetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const inlineStyle = page.match(
    new RegExp(`<style data-inline-stylesheet="[^"]*${escapedAssetName}">([\\s\\S]*?)<\\/style>`),
  );

  assert.ok(inlineStyle, `${pagePath} must inline ${assetPath}`);
  assert.equal(inlineStyle[1].trim(), asset, `${pagePath} has stale inline styles`);
  return page;
}

const propertyStyles = readFileSync("dist/assets/property-enquiry.css", "utf8");
assert.match(propertyStyles, /\.lead-form \.fields > label\s*\{[^}]*align-content:\s*start/s);
assert.match(propertyStyles, /\.lead-form \.fields input[^}]*height:\s*48px/s);
assert.match(propertyStyles, /@media \(max-width:\s*960px\)\s*\{\s*\.lead-form \.fields\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/s);

for (const pagePath of propertyPages) {
  const page = assertInlineStylesMatchAsset(pagePath, "dist/assets/property-enquiry.css");
  assert.match(page, /<form class="lead-form"/, `${pagePath} must contain the property enquiry form`);
}

const visitStyles = readFileSync("dist/assets/site-visit.css", "utf8");
assert.match(visitStyles, /\.booking-form \.field-grid > label\s*\{\s*min-width:\s*0/s);
assert.match(visitStyles, /\.booking-form input:not\(\[type="checkbox"\]\), \.booking-form select\s*\{[^}]*height:\s*48px/s);

for (const pagePath of visitPages) {
  assertInlineStylesMatchAsset(pagePath, "dist/assets/site-visit.css");
}

assert.match(readFileSync("dist/site-visit.html", "utf8"), /<form class="booking-form"/);
console.log("Property enquiry and site-visit form layout styles are consistent across all pages.");
