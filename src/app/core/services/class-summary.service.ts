import { Injectable, computed, signal } from '@angular/core';
import { ClassStats, ClassData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClassSummaryService {
  // Class and subject data
  private classesSignal = signal<string[]>(['4A', '4B', '5A', '5B', '5C', '6A', '6B', '7A', '7B']);
  private subjectsSignal = signal<string[]>(['Matematik', 'Türkçe', 'Fen']);
  
  // Selection signals
  private selectedClassSignal = signal<string | null>(null);
  private selectedSubjectSignal = signal<string | null>(null);

  // Class data
  private defaultClassData: ClassData = {
    copyProb: 15,
    scores: [88, 73, 64, 57, 41, 92, 78, 69, 84, 55, 38, 96, 71, 66, 59, 47, 82, 90, 63, 52]
  };

  private classDataMap: Record<string, ClassData> = {
    '5B|Matematik': {
      copyProb: 12,
      scores: [
        86, 90, 92, 95, 88, // 5 in 85-100
        72, 75, 78, 84,     // 4 in 70-84.99 (total 9)
        60, 62, 66, 68, 69, // 5 in 60-69.99 (total 14)
        50, 55, 58,         // 3 in 50-59.9 (total 17)
        42, 35, 48          // 3 in 0-49.99 (total 20)
      ]
    }
  };

  // Computed stats
  public classStats = computed(() => {
    const c = this.selectedClassSignal();
    const s = this.selectedSubjectSignal();
    if (!c || !s) return null;
    
    const key = `${c}|${s}`;
    const data = this.classDataMap[key] ?? this.defaultClassData;
    const scores = data.scores;
    const total = scores.length || 1;
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / total) * 10) / 10;
    
    const inRange = (min: number, max: number, incMax = true) => (v: number) => 
      v >= min && (incMax ? v <= max : v < max);
    
    const buckets = [
      scores.filter(inRange(85, 100)).length,
      scores.filter(inRange(70, 85, false)).length,
      scores.filter(inRange(60, 70, false)).length,
      scores.filter(inRange(50, 60, false)).length,
      scores.filter(inRange(0, 50, false)).length,
    ];
    
    const percents = buckets.map(n => Math.round((n / total) * 1000) / 10);
    
    return { avg, copyProb: data.copyProb, counts: buckets, percents, total };
  });

  public rangesChartSegments = computed(() => {
    const st = this.classStats();
    if (!st) return [];
    
    const colors = ['#16a34a', '#3b82f6', '#eab308', '#f97316', '#ef4444'];
    const labels = ['85-100', '70-84.99', '60-69.99', '50-59.9', '0-49.99'];
    let offset = 0;
    
    return st.percents.map((p, i) => {
      const seg = { color: colors[i], length: p, offset, label: labels[i], count: st.counts[i] };
      offset += p;
      return seg;
    });
  });

  // Getters
  get classes() { return this.classesSignal; }
  get subjects() { return this.subjectsSignal; }
  get selectedClass() { return this.selectedClassSignal; }
  get selectedSubject() { return this.selectedSubjectSignal; }

  // Actions
  chooseClass(className: string) {
    this.selectedClassSignal.set(className);
    this.selectedSubjectSignal.set(null);
  }

  chooseSubject(subject: string) {
    this.selectedSubjectSignal.set(subject);
  }

  resetClassSummary() {
    this.selectedClassSignal.set(null);
    this.selectedSubjectSignal.set(null);
  }
}
