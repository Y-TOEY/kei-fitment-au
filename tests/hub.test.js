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
});

test("public fitments empty", () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/fitments.json"), "utf8")
  );
  assert.equal(data.fitments.length, 0);
});

test("screens mention Manufacturer spec and independent hub copy", () => {
  const filters = fs.readFileSync(path.join(__dirname, "../filters.html"), "utf8");
  const detail = fs.readFileSync(path.join(__dirname, "../detail.html"), "utf8");
  const results = fs.readFileSync(path.join(__dirname, "../results.html"), "utf8");
  assert.match(filters, /Manufacturer spec/);
  assert.match(detail, /Centre bore|centre bore/i);
  assert.match(results, /Centre bore/);
  assert.match(detail, /Hub unknown/);
});

test("meta steel token #A8AEB6 present in screens", () => {
  for (const f of ["index.html", "filters.html", "results.html", "detail.html"]) {
    const html = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    assert.match(html, /#A8AEB6/i, f);
  }
});

test("viewport friendly widths documented via phone frame CSS", () => {
  const home = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  assert.match(home, /390px|max-width:\s*390|width:\s*390/);
});
