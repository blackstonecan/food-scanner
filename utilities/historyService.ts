import type { ScanHistoryItem } from '@/types/ProductInfo';

// In-memory storage for scan history
let scanHistory: ScanHistoryItem[] = [];
const MAX_HISTORY_ITEMS = 50;

/**
 * Add a scan to history. If the product already exists, update its timestamp.
 */
export const addScanToHistory = (item: ScanHistoryItem): void => {
  // Check if item already exists
  const existingIndex = scanHistory.findIndex((scan) => scan.code === item.code);

  if (existingIndex !== -1) {
    // Remove existing item
    scanHistory.splice(existingIndex, 1);
  }

  // Add new item to the beginning
  scanHistory.unshift(item);

  // Limit history size
  if (scanHistory.length > MAX_HISTORY_ITEMS) {
    scanHistory = scanHistory.slice(0, MAX_HISTORY_ITEMS);
  }
};

/**
 * Get recent scans limited to a specific number
 */
export const getRecentScans = (limit: number): ScanHistoryItem[] => {
  return scanHistory.slice(0, limit);
};

/**
 * Get all scan history
 */
export const getAllScans = (): ScanHistoryItem[] => {
  return [...scanHistory];
};

/**
 * Delete a specific scan item by code
 */
export const deleteScanItem = (code: string): void => {
  scanHistory = scanHistory.filter((scan) => scan.code !== code);
};

/**
 * Clear all scan history
 */
export const clearAllHistory = (): void => {
  scanHistory = [];
};
