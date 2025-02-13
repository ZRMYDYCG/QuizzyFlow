import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @description 合并多个 className
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
