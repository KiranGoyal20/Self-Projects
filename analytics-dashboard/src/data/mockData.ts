import type { DashboardMeta, TabData } from '../types/dashboard'

export const dashboardMeta: DashboardMeta = {
  id: 'analytics-main',
  title: 'Analytics Dashboard',
  subtitle: 'Operational insights across sales, traffic, and product performance',
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'sales', label: 'Sales' },
    { id: 'engagement', label: 'Engagement' },
  ],
}

export const tabDataById: Record<string, TabData> = {
  overview: {
    id: 'overview',
    label: 'Overview',
    grids: [
      {
        id: 'overview-kpis',
        title: 'Key Performance Indicators',
        description: 'Snapshot of business health',
        layout: [
          { i: 'kpi-revenue', x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
          { i: 'kpi-users', x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
          { i: 'kpi-conversion', x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
          { i: 'kpi-churn', x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 2 },
        ],
        widgets: [
          {
            id: 'kpi-revenue',
            title: 'Revenue',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Monthly Revenue',
                  value: 128400,
                  unit: '$',
                  delta: 12.4,
                  deltaLabel: 'vs last month',
                  trend: 'up',
                },
              ],
            },
          },
          {
            id: 'kpi-users',
            title: 'Active Users',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Monthly Active Users',
                  value: 48210,
                  delta: 5.1,
                  deltaLabel: 'vs last month',
                  trend: 'up',
                },
              ],
            },
          },
          {
            id: 'kpi-conversion',
            title: 'Conversion',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Conversion Rate',
                  value: '3.8%',
                  delta: -0.3,
                  deltaLabel: 'vs last month',
                  trend: 'down',
                },
              ],
            },
          },
          {
            id: 'kpi-churn',
            title: 'Churn',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Churn Rate',
                  value: '1.2%',
                  delta: -0.2,
                  deltaLabel: 'vs last month',
                  trend: 'up',
                },
              ],
            },
          },
        ],
      },
      {
        id: 'overview-trends',
        title: 'Trends & Mix',
        description: 'Traffic and channel composition',
        layout: [
          { i: 'line-traffic', x: 0, y: 0, w: 8, h: 8, minW: 4, minH: 5 },
          { i: 'donut-channels', x: 8, y: 0, w: 4, h: 8, minW: 3, minH: 5 },
        ],
        widgets: [
          {
            id: 'line-traffic',
            title: 'Weekly Traffic',
            type: 'line',
            data: {
              categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              series: [
                { name: 'Sessions', data: [4200, 4800, 5100, 4700, 5600, 6100, 5800] },
                { name: 'Page Views', data: [9200, 10100, 11000, 9800, 12100, 13400, 12800] },
              ],
            },
          },
          {
            id: 'donut-channels',
            title: 'Traffic by Channel',
            type: 'donut',
            data: {
              series: [
                {
                  name: 'Channels',
                  data: [
                    { name: 'Organic', y: 38 },
                    { name: 'Paid', y: 24 },
                    { name: 'Direct', y: 18 },
                    { name: 'Referral', y: 12 },
                    { name: 'Social', y: 8 },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },

  sales: {
    id: 'sales',
    label: 'Sales',
    grids: [
      {
        id: 'sales-performance',
        title: 'Sales Performance',
        description: 'Revenue by region and product hierarchy',
        layout: [
          { i: 'bar-regions', x: 0, y: 0, w: 6, h: 8, minW: 4, minH: 5 },
          { i: 'tree-products', x: 6, y: 0, w: 6, h: 8, minW: 4, minH: 5 },
        ],
        widgets: [
          {
            id: 'bar-regions',
            title: 'Revenue by Region',
            type: 'bar',
            data: {
              categories: ['North America', 'Europe', 'APAC', 'LATAM', 'MEA'],
              series: [
                { name: 'Q1', data: [420, 380, 290, 150, 110] },
                { name: 'Q2', data: [460, 410, 320, 175, 125] },
              ],
            },
          },
          {
            id: 'tree-products',
            title: 'Product Revenue Tree',
            type: 'tree',
            data: {
              tree: [
                {
                  name: 'Catalog',
                  children: [
                    {
                      name: 'Hardware',
                      children: [
                        { name: 'Laptops', value: 120 },
                        { name: 'Monitors', value: 68 },
                        { name: 'Accessories', value: 42 },
                      ],
                    },
                    {
                      name: 'Software',
                      children: [
                        { name: 'Subscriptions', value: 210 },
                        { name: 'Licenses', value: 95 },
                      ],
                    },
                    {
                      name: 'Services',
                      children: [
                        { name: 'Support', value: 55 },
                        { name: 'Consulting', value: 78 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        id: 'sales-detail',
        title: 'Deal Pipeline',
        description: 'Opportunity mix and detailed table',
        layout: [
          { i: 'pie-stages', x: 0, y: 0, w: 4, h: 8, minW: 3, minH: 5 },
          { i: 'table-deals', x: 4, y: 0, w: 8, h: 8, minW: 4, minH: 5 },
        ],
        widgets: [
          {
            id: 'pie-stages',
            title: 'Pipeline by Stage',
            type: 'pie',
            data: {
              series: [
                {
                  name: 'Stages',
                  data: [
                    { name: 'Prospect', y: 28 },
                    { name: 'Qualified', y: 22 },
                    { name: 'Proposal', y: 18 },
                    { name: 'Negotiation', y: 16 },
                    { name: 'Closed Won', y: 16 },
                  ],
                },
              ],
            },
          },
          {
            id: 'table-deals',
            title: 'Top Deals',
            type: 'table',
            data: {
              columns: [
                { field: 'deal', headerName: 'Deal', width: 180 },
                { field: 'region', headerName: 'Region', width: 120 },
                { field: 'stage', headerName: 'Stage', width: 120 },
                { field: 'amount', headerName: 'Amount ($)', align: 'right', width: 120 },
                { field: 'owner', headerName: 'Owner', width: 120 },
              ],
              rows: [
                { id: 1, deal: 'Acme Corp Expansion', region: 'NA', stage: 'Negotiation', amount: 120000, owner: 'A. Shah' },
                { id: 2, deal: 'Nordic Retail Suite', region: 'EU', stage: 'Proposal', amount: 86000, owner: 'L. Berg' },
                { id: 3, deal: 'Tokyo Logistics', region: 'APAC', stage: 'Qualified', amount: 64000, owner: 'M. Ito' },
                { id: 4, deal: 'Sao Paulo Banking', region: 'LATAM', stage: 'Closed Won', amount: 152000, owner: 'C. Dias' },
                { id: 5, deal: 'Dubai Energy Portal', region: 'MEA', stage: 'Prospect', amount: 48000, owner: 'R. Ali' },
              ],
            },
          },
        ],
      },
    ],
  },

  engagement: {
    id: 'engagement',
    label: 'Engagement',
    grids: [
      {
        id: 'engagement-behavior',
        title: 'User Behavior',
        description: 'Session depth and cohort engagement',
        layout: [
          { i: 'bubble-sessions', x: 0, y: 0, w: 7, h: 9, minW: 4, minH: 6 },
          { i: 'bar-features', x: 7, y: 0, w: 5, h: 9, minW: 3, minH: 5 },
        ],
        widgets: [
          {
            id: 'bubble-sessions',
            title: 'Session Value vs Duration',
            type: 'bubble',
            data: {
              points: [
                { name: 'New', x: 2.1, y: 18, z: 40 },
                { name: 'Returning', x: 4.8, y: 42, z: 65 },
                { name: 'Power', x: 8.2, y: 78, z: 90 },
                { name: 'Trial', x: 3.4, y: 25, z: 35 },
                { name: 'Churn Risk', x: 1.5, y: 12, z: 28 },
                { name: 'Enterprise', x: 9.1, y: 95, z: 110 },
              ],
            },
          },
          {
            id: 'bar-features',
            title: 'Feature Adoption',
            type: 'bar',
            data: {
              categories: ['Search', 'Dashboards', 'Exports', 'Alerts', 'API'],
              series: [
                { name: 'Adoption %', data: [82, 74, 61, 48, 39] },
              ],
            },
          },
        ],
      },
      {
        id: 'engagement-summary',
        title: 'Engagement Summary',
        layout: [
          { i: 'line-retention', x: 0, y: 0, w: 8, h: 8, minW: 4, minH: 5 },
          { i: 'kpi-nps', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
          { i: 'kpi-csat', x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
        ],
        widgets: [
          {
            id: 'line-retention',
            title: 'Weekly Retention',
            type: 'line',
            data: {
              categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
              series: [
                { name: 'Cohort A', data: [100, 72, 61, 55, 51, 48, 46, 44] },
                { name: 'Cohort B', data: [100, 68, 58, 52, 49, 47, 45, 43] },
              ],
            },
          },
          {
            id: 'kpi-nps',
            title: 'NPS',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Net Promoter Score',
                  value: 47,
                  delta: 3,
                  deltaLabel: 'vs prior quarter',
                  trend: 'up',
                },
              ],
            },
          },
          {
            id: 'kpi-csat',
            title: 'CSAT',
            type: 'kpi',
            data: {
              kpis: [
                {
                  label: 'Customer Satisfaction',
                  value: '4.6/5',
                  delta: 0.1,
                  deltaLabel: 'vs prior quarter',
                  trend: 'up',
                },
              ],
            },
          },
        ],
      },
    ],
  },
}
