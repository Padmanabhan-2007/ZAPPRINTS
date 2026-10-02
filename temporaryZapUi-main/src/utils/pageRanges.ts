// cache buster
import type { PageRange } from '../types/order';

export const calculateSelectedPages = (ranges?: PageRange[]): number => {
  if (!ranges || ranges.length === 0) return 0;
  return ranges.reduce((acc, range) => acc + (range.end - range.start + 1), 0);
};

export const normalizePageRanges = (ranges: PageRange[]): PageRange[] => {
  // Sort ranges by start page
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  
  // Note: Since each range can have different color, sides, and copies,
  // merging overlapping ranges automatically can be destructive.
  // The user requested to "Prevent ambiguous configurations" and "Reject overlap".
  // Normalization here just means returning the sorted ranges, 
  // and we'll use a validation function to explicitly reject overlaps.
  return sorted;
};

export interface RangeValidationResult {
  isValid: boolean;
  error?: string;
}

export const validatePageRanges = (ranges: PageRange[], totalPages: number): RangeValidationResult => {
  if (ranges.length === 0) {
    return { isValid: false, error: 'No pages selected yet.' };
  }

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    
    if (range.start < 1) {
      return { isValid: false, error: 'Start page must be at least 1.' };
    }
    if (range.end > totalPages) {
      return { isValid: false, error: `Page ${range.end} doesn't exist. This file has ${totalPages} pages.` };
    }
    if (range.start > range.end) {
      return { isValid: false, error: 'End page must be greater than or equal to start page.' };
    }
    if (range.copies < 1) {
      return { isValid: false, error: 'Copies must be at least 1.' };
    }
  }

  // Check for overlaps
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end >= sorted[i + 1].start) {
      return { 
        isValid: false, 
        error: `Page range ${sorted[i].start}-${sorted[i].end} overlaps with ${sorted[i+1].start}-${sorted[i+1].end}.` 
      };
    }
  }

  return { isValid: true };
};

export const parsePageRangesInput = (input: string, totalPages: number): PageRange[] => {
  const ranges: PageRange[] = [];
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    const dashIdx = part.indexOf('-');
    let startStr = part;
    let endStr = part;
    
    if (dashIdx !== -1) {
      startStr = part.substring(0, dashIdx).trim();
      endStr = part.substring(dashIdx + 1).trim();
    }
    
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    
    if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > totalPages) {
      throw new Error(`Invalid range: ${part}`);
    }
    
    ranges.push({
      id: Math.random().toString(36).substring(2, 9),
      start,
      end,
      colorMode: 'B_AND_W',
      sides: 'FRONT_ONLY', // default to safe fallback, can be updated by UI
      copies: 1
    });
  }
  
  return normalizePageRanges(ranges);
};
