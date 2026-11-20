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
  const lastUpdated = doc.querySelector("#last-updated");

  metricGrid.innerHTML = [
    metricCardTemplate("Posts published", summary.published),
    metricCardTemplate("Total views", formatCompactNumber(summary.views)),
    metricCardTemplate("Followers gained", `+${summary.followersGained}`),
    metricCardTemplate("Posts scheduled", summary.scheduled),
  ].join("");

  contentGrid.innerHTML = contentItems.map(contentCardTemplate).join("");
  lastUpdated.textContent = "Updated from this week's content log";
}

if (typeof document !== "undefined") {
  renderDashboard(document);
}

if (typeof module !== "undefined") {
  module.exports = {
    contentItems,
    summarizeContent,
    formatCompactNumber,
    metricCardTemplate,
    contentCardTemplate,
  };
}

