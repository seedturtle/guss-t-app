export interface GUSSItem {
  id: string;
  question: string;
  description?: string;
  icon: string; // emoji or image key
  options: {
    label: string;
    value: number;
    score: number;
    next?: 'stop' | 'continue';
  }[];
  cartoonHint?: string; // description of cartoon for this step
}

export interface DirectTestItem {
  id: string;
  question: string;
  description: string;
  icon: string;
  type: 'semi-solid' | 'liquid' | 'solid';
  typeLabel: string;
  typeIcon: string;
  options: {
    label: string;
    value: string;
    score: number;
    stop?: boolean;
  }[];
  cartoonHint: string;
  volumeHint?: string;
}

export interface TestResult {
  date: string;
  examiner: string;
  patientName: string;
  indirectScore: number;
  semiSolidScore: number;
  liquidScore: number;
  solidScore: number;
  totalScore: number;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  iddsiLevels: string[];
  recommendations: string[];
  stopReason?: string;
}