export interface ClassStats {
  avg: number;
  copyProb: number;
  counts: number[];
  percents: number[];
  total: number;
}

export interface ClassData {
  copyProb: number;
  scores: number[];
}

export interface ChartSegment {
  color: string;
  length: number;
  offset: number;
  label: string;
  count: number;
}
