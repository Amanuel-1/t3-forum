import { create } from "zustand"

type TUser = {
  id: string,
  name: string,
  username: string,
  image: string | null,
  bio: string | null,
}

type TAnonymousStore = {
  isAnonymPost: boolean,
  setIsAnonymPost: (isAnonymPost: boolean) => void,
}

type TCurrentUserStore = {
  user: TUser | null,
  setUser: (user: TUser) => void,
}

export const useAnonymousStore = create<TAnonymousStore>((set) => ({
  isAnonymPost: false,
  setIsAnonymPost: (isAnonymPost) => set((state) => ({ isAnonymPost })),
}))

export const useCurrentUserStore = create<TCurrentUserStore>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ user }))
}))
