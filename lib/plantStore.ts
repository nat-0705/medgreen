import { create } from 'zustand'

type PlantStore = {
  refreshKey: number
  incrementRefresh: () => void
}

export const usePlantStore = create<PlantStore>((set) => ({
  refreshKey: 0,
  incrementRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}))
