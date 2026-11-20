const test = require("node:test");
const assert = require("node:assert/strict");

const {
  contentItems,
  summarizeContent,
  formatCompactNumber,
  calculateEngagementRate,
  rankPublishedByEngagement,
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

test("calculateEngagementRate measures all interactions against views", () => {
  const rate = calculateEngagementRate({
    views: 1000,
    likes: 60,
    comments: 15,
    shares: 25,
  });

  assert.equal(rate, 10);
  assert.equal(calculateEngagementRate({ views: 0, likes: 5, comments: 2, shares: 1 }), 0);
});

test("rankPublishedByEngagement excludes scheduled content and sorts descending", () => {
  const ranked = rankPublishedByEngagement(contentItems, 2);

  assert.equal(ranked.length, 2);
  assert.ok(ranked[0].engagementRate >= ranked[1].engagementRate);
  assert.ok(ranked.every((item) => item.status === "Published"));
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

