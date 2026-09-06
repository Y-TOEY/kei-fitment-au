const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const hub = require("../js/hub.js");

test("hubUnknownSummary on when either field not known", () => {
  assert.equal(
    hub.hubUnknownSummary({
      pcd: { value: "4x100", state: "known" },
      centreBore: { state: "unresolved" },
    }),
    true
  );
  assert.equal(
    hub.hubUnknownSummary({
      pcd: { value: "4x100", state: "known" },
      centreBore: { value: "CB54", state: "known" },
    }),
    false
  );
});

test("known PCD is not wiped when centre bore unresolved", () => {
  const d = hub.displayFields({
    pcd: { value: "4×100 · Example", state: "known" },
    centreBore: { state: "unresolved" },
  });
  assert.equal(d.pcdLabel, "4×100 · Example");
  assert.equal(d.centreBoreLabel, "Unresolved");
  assert.equal(d.hubUnknownSummary, true);
});

test("evidence labels include Manufacturer spec", () => {
  assert.ok(hub.EVIDENCE_LABELS.includes("Manufacturer spec"));
  assert.ok(!hub.EVIDENCE_LABELS.includes("Mfr spec"));
  for (const label of ["Confirmed", "Reported", "Manufacturer spec", "Unverified"]) {
    assert.ok(hub.EVIDENCE_LABELS.includes(label), label);
  }
});

test("public fitments empty", () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/fitments.json"), "utf8")
  );
  assert.equal(data.fitments.length, 0);
});

test("screens/JS preserve Manufacturer Spec vocab and independent hub copy", () => {
  const filters = fs.readFileSync(path.join(__dirname, "../filters.html"), "utf8");
  const resultsJs = fs.readFileSync(path.join(__dirname, "../js/results.js"), "utf8");
  const detailJs = fs.readFileSync(path.join(__dirname, "../js/detail.js"), "utf8");

  // Filters UI chips use title-case "Manufacturer Spec"
  assert.match(filters, /Manufacturer\s+Spec/i);
  assert.match(filters, /Confirmed/);
  assert.match(filters, /Reported/);
  assert.match(filters, /Unverified/);

  // Detail/results render hub fields independently; unresolved centre bore does not wipe PCD
  assert.match(detailJs, /Centre bore/i);
  assert.match(detailJs, /Manufacturer Specification/i);
  assert.match(resultsJs, /Centre bore/i);
  assert.match(resultsJs, /Hub unknown/i);
  assert.match(resultsJs, /PCD shown independently/i);
});

test("meta steel token #A8AEB6 present via CSS --steel", () => {
  const cssFiles = ["css/home.css", "css/results.css"];
  for (const f of cssFiles) {
    const css = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    assert.match(css, /--steel:\s*#A8AEB6/i, f);
  }
});

test("responsive viewport (no phone-frame shell) documented", () => {
  const home = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  const homeCss = fs.readFileSync(path.join(__dirname, "../css/home.css"), "utf8");
  assert.match(home, /viewport[^>]*width=device-width/i);
  // Site is full-viewport responsive; phone-frame width is no longer hard-coded in HTML
  assert.match(homeCss, /not phone frame|device-width|@media\s*\(/i);
  assert.match(homeCss, /max-width:\s*\d+px/i);
});
