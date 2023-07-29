import { create } from "zustand"

type TAnonymousStore = {
  isAnonymPost: boolean,
  setIsAnonymPost: (isAnonymPost: boolean) => void,
}

export const useAnonymousStore = create<TAnonymousStore>((set) => ({
  isAnonymPost: false,
  setIsAnonymPost: (isAnonymPost) => set((state) => ({ isAnonymPost })),
}))

