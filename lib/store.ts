import { create } from "zustand"
import { TUser } from "./utils"

type TAnonymousStore = {
  isAnonymPost: boolean,
  setIsAnonymPost: (isAnonymPost: boolean) => void,
}

type TCurrentUserStore = {
  user: TUser | null,
  setUser: (user: TUser) => void,
}

type TPostCategory = {
  categoryId: "1" | "2",
  setCategoryId: (categoryId: "1" | "2") => void
}

export const useAnonymousStore = create<TAnonymousStore>((set) => ({
  isAnonymPost: false,
  setIsAnonymPost: (isAnonymPost) => set((state) => ({ isAnonymPost })),
}))

export const useCurrentUserStore = create<TCurrentUserStore>((set) => ({
  user: null,
  setUser: (user) => set((state) => ({ user }))
}))

export const usePostCategory = create<TPostCategory>((set) => ({
  categoryId: "1",
  setCategoryId: (categoryId) => set((state) => ({ categoryId }))
}))
