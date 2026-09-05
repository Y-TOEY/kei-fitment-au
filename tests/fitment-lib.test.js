const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const lib = require("../js/fitment-lib.js");

const dataPath = path.join(__dirname, "../data/fitments.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

test("public fitments array is empty (no ungated live rows)", () => {
  assert.equal(Array.isArray(data.fitments), true);
  assert.equal(data.fitments.length, 0);
});

test("scaffold examples are isolated and excluded from publicFitments", () => {
  assert.ok(Array.isArray(data.scaffoldExamples));
  assert.ok(data.scaffoldExamples.length > 0);
  const mixed = [...data.fitments, ...data.scaffoldExamples];
  const pub = lib.publicFitments(mixed);
  assert.equal(pub.length, 0);
  for (const row of data.scaffoldExamples) {
    assert.equal(lib.isPublicFitment(row), false);
  }
});

test("hard-excludes scaffold-* ids even if mixed into fitments", () => {
  const sneaky = {
    id: "scaffold-999",
    suspension: "stock",
    wheelDiameterIn: 14,
    wheelWidthIn: 5.5,
    tyreSize: "185/65R14",
  };
  assert.equal(lib.isPublicFitment(sneaky), false);
  assert.deepEqual(lib.publicFitments([sneaky]), []);
});

test("matches filters by suspension, diameter, width, tyre", () => {
  const row = {
    id: "gated-1",
    suspension: "stock",
    wheelDiameterIn: 14,
    wheelWidthIn: 5.5,
    tyreSize: "185/65R14",
  };
  assert.equal(
    lib.matches(row, { suspension: "all", diameter: "all", width: "all", tyre: "all" }),
    true
  );
  assert.equal(
    lib.matches(row, { suspension: "stock", diameter: "14", width: "5.5", tyre: "185/65R14" }),
    true
  );
  assert.equal(
    lib.matches(row, { suspension: "lifted", diameter: "all", width: "all", tyre: "all" }),
    false
  );
});

test("empty public set yields no matches (empty-state path)", () => {
  const pub = lib.publicFitments(data.fitments);
  const filtered = pub.filter((r) =>
    lib.matches(r, { suspension: "all", diameter: "all", width: "all", tyre: "all" })
  );
  assert.equal(filtered.length, 0);
});

test("formatOffset and hubLabel handle null/unknown", () => {
  assert.equal(lib.formatOffset(null), "Unknown");
  assert.equal(lib.formatOffset(35), "35 mm");
  assert.equal(
    lib.hubLabel({ hubBoreMm: null, hubBoreStatus: "unknown" }),
    "Unknown / unresolved"
  );
  assert.equal(
    lib.hubLabel({ hubBoreMm: 54, hubBoreStatus: "unknown" }),
    "Unknown / unresolved"
  );
});

test("confidenceClass maps every evidenceConfidence enum", () => {
  assert.equal(lib.confidenceClass("Confirmed"), "badge-confirmed");
  assert.equal(lib.confidenceClass("Reported"), "badge-reported");
  assert.equal(lib.confidenceClass("Manufacturer specification"), "badge-manufacturer");
  assert.equal(lib.confidenceClass("Unverified"), "badge-unverified");
  assert.equal(lib.confidenceClass("nope"), "badge-unverified");
  for (const level of lib.EVIDENCE_LEVELS) {
    assert.match(lib.confidenceClass(level), /^badge-/);
  }
});

test("escapeHtml escapes markup", () => {
  assert.equal(lib.escapeHtml('<img src=x onerror="alert(1)">'), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  assert.equal(lib.escapeHtml("a & b"), "a &amp; b");
});

test("tagline source does not say Every DA16T", () => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  assert.equal(/Every\s+DA16T/i.test(html), false);
  assert.match(html, /Carry\s*\/\s*Super Carry DA16T/);
});
