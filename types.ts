
export interface MotifDetail {
  stt: number;
  motif: string;
  technique: string;
  dmcCode: string;
  colorName: string;
  colorHex: string;
  timeMinutes: number;
  technicalRequirement: string;
}

export interface PaletteItem {
  code: string;
  name: string;
  hex: string;
}

export interface LSXData {
  orderCode: string;
  productType: string;
  fabric: string;
  theme: string;
  details: MotifDetail[];
  totalTime: number;
  palette: PaletteItem[];
  qcNote: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
