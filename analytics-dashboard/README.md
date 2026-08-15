# Analytics Dashboard

React analytics dashboard with Material UI, Highcharts, and react-grid-layout.

## Stack

- Vite + React + TypeScript
- Material UI (`@mui/material`)
- Highcharts (`highcharts` + `highcharts-react-official`)
- react-grid-layout (draggable / resizable grids)

## Data flow

1. `fetchDashboard()` loads dashboard metadata and tab list
2. Selecting a tab calls `fetchTabData(tabId)` (cached after first load)
3. Each tab returns multiple **grids**
4. Each grid has a layout + widgets rendered as charts (bar, line, pie, donut, bubble, tree, KPI, table)

Mock APIs live in `src/api/mockApi.ts` with sample payloads in `src/data/mockData.ts`.

## Run

```bash
cd analytics-dashboard
npm install
npm run dev
```

## Replace mocks with real APIs

Swap `fetchDashboard` / `fetchTabData` to point at your backend while keeping the types in `src/types/dashboard.ts`.
