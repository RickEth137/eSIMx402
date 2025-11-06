import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2)
}

export function formatDuration(days: number): string {
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  if (days === 30) return '1 month'
  if (days < 365) return `${Math.round(days / 30)} months`
  return `${Math.round(days / 365)} years`
}

export function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function generateOrderId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}