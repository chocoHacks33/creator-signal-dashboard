const test = require("node:test");
const assert = require("node:assert/strict");

const {
  contentItems,
  summarizeContent,
  formatCompactNumber,
  daysUntil,
  scheduleTimingLabel,
  metricCardTemplate,
  contentCardTemplate,
} = require("../app.js");

test("sample content includes published and scheduled work", () => {
  assert.ok(contentItems.some((item) => item.status === "Published"));
  assert.ok(contentItems.some((item) => item.status === "Scheduled"));
});

test("daysUntil compares date-only values at UTC midnight", () => {
  assert.equal(daysUntil("2026-11-22", new Date("2026-11-21T23:30:00Z")), 1);
  assert.equal(daysUntil("2026-11-22", new Date("2026-11-22T07:30:00Z")), 0);
  assert.equal(daysUntil("2026-11-20", new Date("2026-11-22T07:30:00Z")), -2);
});

test("scheduleTimingLabel describes upcoming and overdue posts", () => {
  const today = new Date("2026-11-21T12:00:00Z");

  assert.equal(
    scheduleTimingLabel({ status: "Scheduled", publishedAt: "2026-11-22" }, today),
    "Scheduled for tomorrow",
  );
  assert.equal(
    scheduleTimingLabel({ status: "Scheduled", publishedAt: "2026-11-19" }, today),
    "2 days overdue",
  );
  assert.equal(
    scheduleTimingLabel({ status: "Published", publishedAt: "2026-11-22" }, today),
    "",
  );
});

test("scheduled cards include their UTC-safe timing label", () => {
  const html = contentCardTemplate(
    {
      title: "Tomorrow's upload",
      platform: "YouTube",
      status: "Scheduled",
      publishedAt: "2026-11-22",
      views: 0,
      followersGained: 0,
    },
    new Date("2026-11-21T23:00:00Z"),
  );

  assert.match(html, /Scheduled for tomorrow/);
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

