import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  if (seconds < 60) return 'الآن';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `قبل ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `قبل ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `قبل ${days} يوم`;
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}

export function truncate(text: string, max = 60): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export function generateTitle(firstMessage: string): string {
  return truncate(firstMessage.replace(/\n+/g, ' ').trim(), 50);
}
