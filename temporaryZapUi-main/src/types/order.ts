export interface FileConfig {
  id: string;
  originalFilename: string;
  displayPageCount?: number;
  zapInternalPageValue?: number;
  pageCount?: number;
  liveEstimate?: number;
  colorMode: 'B_AND_W' | 'COLOR';
  sides: 'FRONT_AND_BACK' | 'FRONT_ONLY';
  serviceType: 'A4_DOCUMENT' | 'SOFT_BINDING';
  copies: number;
  processingStatus: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  errorMessage?: string;
  file?: File;
  printMode?: 'ENTIRE_FILE' | 'SPECIFIC_PAGES';
  pageRanges?: PageRange[];
}

export interface PageRange {
  id: string;
  start: number;
  end: number;
  colorMode: 'B_AND_W' | 'COLOR';
  sides: 'FRONT_AND_BACK' | 'FRONT_ONLY';
  copies: number;
}

export type OrderStage = 'UPLOAD' | 'CONFIGURE' | 'REVIEW';

export interface PricingRates {
  bw: number;
  color: number;
  binding: number;
}
