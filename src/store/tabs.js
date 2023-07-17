
import { TABS } from "../utils/constant";

export const createTabsStore = (set, get) => (
  {
    activeTab: TABS.HUB, // 默认分享中心
    setActiveTab: (tabName) => set((state) => ({ ...state, activeTab: TABS[tabName] })),
  }
)
