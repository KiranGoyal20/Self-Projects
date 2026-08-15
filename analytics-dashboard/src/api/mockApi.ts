import { dashboardMeta, tabDataById } from '../data/mockData'
import type { DashboardMeta, TabData } from '../types/dashboard'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Simulates fetching dashboard shell + tab list */
export async function fetchDashboard(): Promise<DashboardMeta> {
  await delay(400)
  return structuredClone(dashboardMeta)
}

/** Simulates fetching a tab's grids + widget chart data */
export async function fetchTabData(tabId: string): Promise<TabData> {
  await delay(550)
  const tab = tabDataById[tabId]
  if (!tab) {
    throw new Error(`Tab not found: ${tabId}`)
  }
  return structuredClone(tab)
}
