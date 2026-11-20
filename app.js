const contentItems = [
  {
    id: 1,
    title: "Five-minute desk reset",
    platform: "YouTube",
    status: "Published",
    publishedAt: "2026-11-16",
    views: 18420,
    followersGained: 143,
  },
  {
    id: 2,
    title: "The tiny systems behind calm weeks",
    platform: "Newsletter",
    status: "Published",
    publishedAt: "2026-11-17",
    views: 6830,
    followersGained: 84,
  },
  {
    id: 3,
    title: "Before-and-after workspace tour",
    platform: "Instagram",
    status: "Published",
    publishedAt: "2026-11-18",
    views: 12100,
    followersGained: 96,
  },
  {
    id: 4,
    title: "Three cues that make habits stick",
    platform: "TikTok",
    status: "Published",
    publishedAt: "2026-11-19",
    views: 22900,
    followersGained: 177,
  },
  {
    id: 5,
    title: "A kinder weekly review",
    platform: "Newsletter",
    status: "Scheduled",
    publishedAt: "2026-11-21",
    views: 0,
    followersGained: 0,
  },
  {
    id: 6,
    title: "Sunday planning without the pressure",
    platform: "YouTube",
    status: "Scheduled",
    publishedAt: "2026-11-22",
    views: 0,
    followersGained: 0,
  },
];

const reportingDays = [
  "2026-11-16",
  "2026-11-17",
  "2026-11-18",
  "2026-11-19",
  "2026-11-20",
  "2026-11-21",
  "2026-11-22",
];

function summarizeContent(items) {
  return items.reduce(
    (summary, item) => {
      if (item.status === "Published") {
        summary.published += 1;
        summary.views += item.views;
        summary.followersGained += item.followersGained;
      } else if (item.status === "Scheduled") {
        summary.scheduled += 1;
      }

      return summary;
    },
    { published: 0, views: 0, followersGained: 0, scheduled: 0 },
  );
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildReachTrend(items, days) {
  const viewsByDay = new Map(days.map((day) => [day, 0]));

  items.forEach((item) => {
    if (item.status === "Published" && viewsByDay.has(item.publishedAt)) {
      viewsByDay.set(item.publishedAt, viewsByDay.get(item.publishedAt) + item.views);
    }
  });

  return days.map((day) => ({ day, views: viewsByDay.get(day) }));
}

function reachRowTemplate(point, maxViews) {
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${point.day}T00:00:00Z`));
  const percent = maxViews > 0 ? (point.views / maxViews) * 100 : 0;

  return `
    <li class="reach-row" aria-label="${dateLabel}: ${point.views.toLocaleString("en")} views">
      <span class="reach-date">${dateLabel}</span>
      <span class="reach-track" aria-hidden="true">
        <span class="reach-fill" style="--reach-size: ${percent.toFixed(1)}%"></span>
      </span>
      <strong class="reach-value">${formatCompactNumber(point.views)}</strong>
    </li>
  `;
}

function metricCardTemplate(label, value) {
  return `
    <article class="metric-card">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
    </article>
  `;
}

function contentCardTemplate(item) {
  const displayDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${item.publishedAt}T00:00:00Z`));

  const viewLabel = item.status === "Published" ? formatCompactNumber(item.views) : "—";

  return `
    <article class="content-card">
      <div class="card-meta">
        <span class="platform-badge">${item.platform}</span>
        <span class="status-badge" data-status="${item.status}">${item.status}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="publish-date">${item.status === "Published" ? "Published" : "Scheduled for"} ${displayDate}</p>
      <div class="card-stats">
        <span><strong>${viewLabel}</strong> views</span>
        <span><strong>${item.followersGained || "—"}</strong> new followers</span>
      </div>
    </article>
  `;
}

function renderDashboard(doc = document) {
  const summary = summarizeContent(contentItems);
  const metricGrid = doc.querySelector("#metric-grid");
  const contentGrid = doc.querySelector("#content-grid");
  const reachTrend = doc.querySelector("#reach-trend");
  const lastUpdated = doc.querySelector("#last-updated");

  metricGrid.innerHTML = [
    metricCardTemplate("Posts published", summary.published),
    metricCardTemplate("Total views", formatCompactNumber(summary.views)),
    metricCardTemplate("Followers gained", `+${summary.followersGained}`),
    metricCardTemplate("Posts scheduled", summary.scheduled),
  ].join("");

  contentGrid.innerHTML = contentItems.map(contentCardTemplate).join("");
  const trend = buildReachTrend(contentItems, reportingDays);
  const maxViews = Math.max(...trend.map((point) => point.views));
  reachTrend.innerHTML = trend.map((point) => reachRowTemplate(point, maxViews)).join("");
  lastUpdated.textContent = "Updated from this week's content log";
}

if (typeof document !== "undefined") {
  renderDashboard(document);
}

if (typeof module !== "undefined") {
  module.exports = {
    contentItems,
    reportingDays,
    summarizeContent,
    formatCompactNumber,
    buildReachTrend,
    reachRowTemplate,
    metricCardTemplate,
    contentCardTemplate,
  };
}

