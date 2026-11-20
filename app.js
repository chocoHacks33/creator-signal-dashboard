const contentItems = [
  {
    id: 1,
    title: "Five-minute desk reset",
    platform: "YouTube",
    status: "Published",
    publishedAt: "2026-11-16",
    views: 18420,
    followersGained: 143,
    likes: 1240,
    comments: 94,
    shares: 108,
  },
  {
    id: 2,
    title: "The tiny systems behind calm weeks",
    platform: "Newsletter",
    status: "Published",
    publishedAt: "2026-11-17",
    views: 6830,
    followersGained: 84,
    likes: 510,
    comments: 82,
    shares: 64,
  },
  {
    id: 3,
    title: "Before-and-after workspace tour",
    platform: "Instagram",
    status: "Published",
    publishedAt: "2026-11-18",
    views: 12100,
    followersGained: 96,
    likes: 1530,
    comments: 71,
    shares: 210,
  },
  {
    id: 4,
    title: "Three cues that make habits stick",
    platform: "TikTok",
    status: "Published",
    publishedAt: "2026-11-19",
    views: 22900,
    followersGained: 177,
    likes: 2480,
    comments: 119,
    shares: 355,
  },
  {
    id: 5,
    title: "A kinder weekly review",
    platform: "Newsletter",
    status: "Scheduled",
    publishedAt: "2026-11-21",
    views: 0,
    followersGained: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    id: 6,
    title: "Sunday planning without the pressure",
    platform: "YouTube",
    status: "Scheduled",
    publishedAt: "2026-11-22",
    views: 0,
    followersGained: 0,
    likes: 0,
    comments: 0,
    shares: 0,
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

function calculateEngagementRate(item) {
  if (!item.views) {
    return 0;
  }

  const interactions = item.likes + item.comments + item.shares;
  return (interactions / item.views) * 100;
}

function rankPublishedByEngagement(items, limit = 3) {
  return items
    .filter((item) => item.status === "Published" && item.views > 0)
    .map((item) => ({ ...item, engagementRate: calculateEngagementRate(item) }))
    .sort((left, right) => right.engagementRate - left.engagementRate)
    .slice(0, limit);
}

function engagementCardTemplate(item, index) {
  const interactions = item.likes + item.comments + item.shares;

  return `
    <article class="insight-card">
      <span class="insight-rank" aria-label="Rank ${index + 1}">${index + 1}</span>
      <h3>${item.title}</h3>
      <p class="engagement-rate">${item.engagementRate.toFixed(1)}% engagement</p>
      <p class="muted">${formatCompactNumber(interactions)} interactions on ${item.platform}</p>
    </article>
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
  const engagementGrid = doc.querySelector("#engagement-grid");
  const lastUpdated = doc.querySelector("#last-updated");

  metricGrid.innerHTML = [
    metricCardTemplate("Posts published", summary.published),
    metricCardTemplate("Total views", formatCompactNumber(summary.views)),
    metricCardTemplate("Followers gained", `+${summary.followersGained}`),
    metricCardTemplate("Posts scheduled", summary.scheduled),
  ].join("");

  contentGrid.innerHTML = contentItems.map(contentCardTemplate).join("");
  engagementGrid.innerHTML = rankPublishedByEngagement(contentItems)
    .map(engagementCardTemplate)
    .join("");
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
    calculateEngagementRate,
    rankPublishedByEngagement,
    engagementCardTemplate,
    metricCardTemplate,
    contentCardTemplate,
  };
}

