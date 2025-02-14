// store/feedback-store.ts
import { useEffect } from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  urlId: string | null
  isActive: boolean
  _hasHydrated: boolean
}

type Actions = {
  setUrlId: (urlId: string | null) => void
  toggleActive: () => void
  reset: () => void
  setHasHydrated: (state: boolean) => void
}

export const useFeedbackStore = create<State & Actions>()(
  immer((set) => ({
    urlId: null,
    isActive: true,
    _hasHydrated: false,
    setUrlId: (urlId) => set((state) => {
      state.urlId = urlId
      state.isActive = true
    }),
    toggleActive: () => set((state) => {
      state.isActive = !state.isActive
    }),
    reset: () => set(() => ({
      urlId: null,
      isActive: true
    })),
    
    setHasHydrated: (state) => set(() => ({
      _hasHydrated: state
    }))
  }))
)

// Hydration hook
export const useStoreHydration = () => {
  const setHasHydrated = useFeedbackStore((state) => state.setHasHydrated)
  
  useEffect(() => {
    // Set hydration complete after first client-side render
    setHasHydrated(true)
  }, [setHasHydrated])
}