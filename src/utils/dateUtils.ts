import { ExpiryStatus } from '../types';

/**
 * Calculates remaining days from today until the target date.
 * Returns negative if expired.
 */
export function calculateDaysRemaining(expiryDateStr?: string): number | null {
  if (!expiryDateStr) return null;
  const target = new Date(expiryDateStr);
  if (isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines exact ExpiryStatus:
 * - Expired: days < 0
 * - Expiring Soon: 0 <= days <= thresholdDays (default 30)
 * - Active: days > thresholdDays
 * - No Expiry Date: when date is undefined or empty
 */
export function getExpiryStatus(
  expiryDateStr?: string,
  thresholdDays = 30
): { status: ExpiryStatus; daysRemaining: number | null; label: string; color: 'emerald' | 'amber' | 'rose' | 'slate' } {
  if (!expiryDateStr) {
    return {
      status: 'No Expiry Date',
      daysRemaining: null,
      label: 'No Expiry',
      color: 'slate',
    };
  }

  const days = calculateDaysRemaining(expiryDateStr);
  if (days === null) {
    return {
      status: 'No Expiry Date',
      daysRemaining: null,
      label: 'No Expiry',
      color: 'slate',
    };
  }

  if (days < 0) {
    return {
      status: 'Expired',
      daysRemaining: days,
      label: `Expired ${Math.abs(days)}d ago`,
      color: 'rose',
    };
  }

  if (days <= thresholdDays) {
    return {
      status: 'Expiring Soon',
      daysRemaining: days,
      label: days === 0 ? 'Expires today' : `${days} days left`,
      color: 'amber',
    };
  }

  if (days > 365) {
    const years = (days / 365).toFixed(1).replace('.0', '');
    return {
      status: 'Active',
      daysRemaining: days,
      label: `${years}y left`,
      color: 'emerald',
    };
  }

  const months = Math.floor(days / 30);
  return {
    status: 'Active',
    daysRemaining: days,
    label: months > 0 ? `${months}m left` : `${days}d left`,
    color: 'emerald',
  };
}

/**
 * Calculates expiry date given a start date and duration.
 */
export function calculateExpiryFromPeriod(startDateStr: string, durationStr: string): string {
  if (!startDateStr) return '';
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return '';

  const lower = durationStr.toLowerCase();
  if (lower.includes('6 month')) {
    date.setMonth(date.getMonth() + 6);
  } else if (lower.includes('1 year') || lower.includes('12 month')) {
    date.setFullYear(date.getFullYear() + 1);
  } else if (lower.includes('2 year')) {
    date.setFullYear(date.getFullYear() + 2);
  } else if (lower.includes('3 year')) {
    date.setFullYear(date.getFullYear() + 3);
  } else if (lower.includes('5 year')) {
    date.setFullYear(date.getFullYear() + 5);
  } else if (lower.includes('lifetime')) {
    date.setFullYear(date.getFullYear() + 50);
  } else {
    // Default 1 year if unknown
    date.setFullYear(date.getFullYear() + 1);
  }

  return date.toISOString().split('T')[0];
}

/**
 * Formats YYYY-MM-DD to "12 Jan 2026"
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return 'Not provided';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

