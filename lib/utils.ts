import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function excludeFields<Model, Key extends keyof Model>(model: Model, keys: Key[]) {
  // @ts-ignore
  return Object.fromEntries(Object.entries(model).filter(([key]) => !keys.includes(key)))
}
