const test = require("node:test");
const assert = require("node:assert/strict");

const {
  contentItems,
  summarizeContent,
  formatCompactNumber,
  summarizePlatforms,
  platformCardTemplate,
  metricCardTemplate,
  contentCardTemplate,
} = require("../app.js");

test("sample content includes published and scheduled work", () => {
  assert.ok(contentItems.some((item) => item.status === "Published"));
  assert.ok(contentItems.some((item) => item.status === "Scheduled"));
});

test("summarizePlatforms aggregates published results and ranks by views", () => {
  const summaries = summarizePlatforms([
    { platform: "Video", status: "Published", views: 100, followersGained: 4 },
    { platform: "Video", status: "Published", views: 250, followersGained: 8 },
    { platform: "Mail", status: "Published", views: 500, followersGained: 5 },
    { platform: "Mail", status: "Scheduled", views: 900, followersGained: 20 },
  ]);

  assert.deepEqual(summaries, [
    { platform: "Mail", posts: 1, views: 500, followersGained: 5 },
    { platform: "Video", posts: 2, views: 350, followersGained: 12 },
  ]);
});

test("platformCardTemplate uses singular post grammar", () => {
  const html = platformCardTemplate({
    platform: "Newsletter",
    posts: 1,
    views: 1200,
    followersGained: 14,
  });

  assert.match(html, /Newsletter/);
  assert.match(html, /1 post · \+14 followers/);
  assert.match(html, /1\.2K/);
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

