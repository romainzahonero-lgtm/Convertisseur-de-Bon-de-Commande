export interface OrderItem {
  sku: string | null;
  ean13: string | null;
  designation: string;
  quantity: number;
  purchasePrice: number;
  lineTotalHT: number;
}

export interface OrderHeader {
  proformaDate: string | null;
  proformaNumber: string | null;
}

export interface ExtractedData {
  header: OrderHeader;
  items: OrderItem[];
}

export enum AppState {
  INITIAL = 'INITIAL',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
}
