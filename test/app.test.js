const test = require("node:test");
const assert = require("node:assert/strict");

const {
  contentItems,
  summarizeContent,
  formatCompactNumber,
  sortContentItems,
  metricCardTemplate,
  contentCardTemplate,
} = require("../app.js");

test("sample content includes published and scheduled work", () => {
  assert.ok(contentItems.some((item) => item.status === "Published"));
  assert.ok(contentItems.some((item) => item.status === "Scheduled"));
});

test("sortContentItems supports date and view ordering without mutating input", () => {
  const items = [
    { id: 1, publishedAt: "2026-11-18", views: 200 },
    { id: 2, publishedAt: "2026-11-20", views: 100 },
    { id: 3, publishedAt: "2026-11-19", views: 300 },
  ];

  assert.deepEqual(sortContentItems(items, "newest").map((item) => item.id), [2, 3, 1]);
  assert.deepEqual(sortContentItems(items, "oldest").map((item) => item.id), [1, 3, 2]);
  assert.deepEqual(sortContentItems(items, "views").map((item) => item.id), [3, 1, 2]);
  assert.deepEqual(items.map((item) => item.id), [1, 2, 3]);
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

