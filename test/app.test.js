const test = require("node:test");
const assert = require("node:assert/strict");

const {
  contentItems,
  summarizeContent,
  formatCompactNumber,
  escapeCsvCell,
  contentToCsv,
  metricCardTemplate,
  contentCardTemplate,
} = require("../app.js");

test("sample content includes published and scheduled work", () => {
  assert.ok(contentItems.some((item) => item.status === "Published"));
  assert.ok(contentItems.some((item) => item.status === "Scheduled"));
});

test("summarizeContent totals only published performance", () => {
  const summary = summarizeContent([
    { status: "Published", views: 1200, followersGained: 14 },
    { status: "Published", views: 800, followersGained: 6 },
    { status: "Scheduled", views: 5000, followersGained: 100 },
  ]);

  assert.deepEqual(summary, {
    published: 2,
    views: 2000,
    followersGained: 20,
    scheduled: 1,
  });
});

test("formatCompactNumber keeps large dashboard values readable", () => {
  assert.equal(formatCompactNumber(18420), "18.4K");
  assert.equal(formatCompactNumber(950), "950");
});

test("escapeCsvCell quotes punctuation and neutralizes spreadsheet formulas", () => {
  assert.equal(escapeCsvCell('A title, with "quotes"'), '"A title, with ""quotes"""');
  assert.equal(escapeCsvCell("=IMPORTXML(A1)"), '"\'=IMPORTXML(A1)"');
  assert.equal(escapeCsvCell("  +SUM(A1:A2)"), '"\'  +SUM(A1:A2)"');
});

test("contentToCsv exports a stable header and one row per content item", () => {
  const csv = contentToCsv(contentItems);
  const rows = csv.split("\r\n");

  assert.equal(rows.length, contentItems.length + 1);
  assert.equal(
    rows[0],
    '"Title","Platform","Status","Publish date","Views","Followers gained"',
  );
  assert.match(rows[1], /"Five-minute desk reset","YouTube","Published"/);
});

test("metric card template exposes its label and value", () => {
  const html = metricCardTemplate("Total views", "60.3K");

  assert.match(html, /Total views/);
  assert.match(html, /60\.3K/);
});

test("scheduled content cards do not imply existing views", () => {
  const html = contentCardTemplate({
    title: "Tomorrow's upload",
    platform: "YouTube",
    status: "Scheduled",
    publishedAt: "2026-11-22",
    views: 900,
    followersGained: 0,
  });

  assert.match(html, /Scheduled for Nov 22/);
  assert.doesNotMatch(html, />900<\/strong> views/);
});

