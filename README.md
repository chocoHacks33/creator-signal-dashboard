# Creator Signal Dashboard

A small, dependency-free dashboard for creators who want a calm weekly view of published content, reach, follower growth, and upcoming posts.

## What it includes

- Summary cards for published posts, total views, follower growth, and scheduled content
- A recent-content feed spanning video, social, and newsletter channels
- UTC-safe timing labels for scheduled and overdue posts
- Responsive styling and semantic dashboard landmarks
- Sample data that can be replaced with an API or local persistence later

## Run locally

Open `index.html` directly in a browser, or serve the directory with any static server:

```sh
npx serve .
```

## Validate

```sh
npm test
npm run check
```

The app uses only HTML, CSS, and JavaScript. The tests use Node's built-in test runner, so there are no package dependencies to install.

