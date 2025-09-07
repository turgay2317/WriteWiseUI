import { Injectable, computed, signal } from '@angular/core';
import { ClassStats, ClassData } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ClassApiService {
  // Class and subject data
  private classesSignal = signal<string[]>(['4A', '4B', '5A', '5B', '5C', '6A', '6B', '7A', '7B']);
  private subjectsSignal = signal<string[]>(['Matematik', 'Türkçe', 'Fen']);
  private classSortOrderSignal = signal<'asc' | 'desc'>('asc');
  private subjectSortOrderSignal = signal<'asc' | 'desc'>('asc');
  private classExamSortBySignal = signal<'subject' | 'date'>('subject');
  private classExamSortOrderSignal = signal<'asc' | 'desc'>('asc');

  // Exams per class (subject + date) demo data
  private defaultClassExams = [
    { subject: 'Matematik', date: '12 Ekim' },
    { subject: 'Türkçe', date: '10 Kasım' },
    { subject: 'Fen', date: '20 Aralık' }
  ];
  private classExamsSignal = signal<Record<string, { subject: string; date: string }[]>>({});
  
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
  public sortedClasses = computed(() => {
    const order = this.classSortOrderSignal();
    const list = [...this.classesSignal()];
    return list.sort((a, b) => {
      const ap = this.parseClassNameParts(a);
      const bp = this.parseClassNameParts(b);
      let cmp = 0;
      if (ap.grade !== bp.grade) cmp = ap.grade < bp.grade ? -1 : 1;
      else if (ap.section !== bp.section) cmp = ap.section < bp.section ? -1 : 1;
      else cmp = 0;
      return order === 'asc' ? cmp : -cmp;
    });
  });

  public sortedSubjects = computed(() => {
    const order = this.subjectSortOrderSignal();
    const list = [...this.subjectsSignal()];
    return list.sort((a, b) => {
      const cmp = a.localeCompare(b, 'tr');
      return order === 'asc' ? cmp : -cmp;
    });
  });

  public currentClassExams = computed(() => {
    const cls = this.selectedClassSignal();
    const by = this.classExamSortBySignal();
    const order = this.classExamSortOrderSignal();
    const list = cls ? (this.classExamsSignal()[cls] ?? this.defaultClassExams) : this.defaultClassExams;
    const arr = [...list];
    return arr.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      if (by === 'subject') {
        aVal = a.subject.toLowerCase();
        bVal = b.subject.toLowerCase();
      } else {
        aVal = this.parseTurkishDate(a.date);
        bVal = this.parseTurkishDate(b.date);
      }
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });

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
    
    const colors = ['#80b48c', '#7aa5f9', '#a0bfb9', '#c0cfd0', '#5e9167'];
    const labels = ['85-100', '70-84.99', '60-69.99', '50-59.9', '0-49.99'];
    let offset = 0;
    
    return st.percents.map((p, i) => {
      const seg = { color: colors[i], length: p, offset, label: labels[i], count: st.counts[i] };
      offset += p;
      return seg;
    });
  });

  public donutGradient = computed(() => {
    const segments = this.rangesChartSegments();
    if (!segments.length) return 'conic-gradient(#e5e7eb 0 100%)';
    const stops = segments.map(seg => `${seg.color} ${seg.offset}% ${seg.offset + seg.length}%`).join(', ');
    return `conic-gradient(${stops})`;
  });

  // Getters
  get classes() { return this.classesSignal; }
  get subjects() { return this.subjectsSignal; }
  get selectedClass() { return this.selectedClassSignal; }
  get selectedSubject() { return this.selectedSubjectSignal; }
  get classSortOrder() { return this.classSortOrderSignal; }
  get subjectSortOrder() { return this.subjectSortOrderSignal; }
  get classExamSortBy() { return this.classExamSortBySignal; }
  get classExamSortOrder() { return this.classExamSortOrderSignal; }

  // Actions
  chooseClass(className: string) {
    this.selectedClassSignal.set(className);
    this.selectedSubjectSignal.set(null);
  }

  chooseSubject(subject: string) {
    this.selectedSubjectSignal.set(subject);
  }

  sortClasses() {
    this.classSortOrderSignal.set(this.classSortOrderSignal() === 'asc' ? 'desc' : 'asc');
  }

  sortSubjects() {
    this.subjectSortOrderSignal.set(this.subjectSortOrderSignal() === 'asc' ? 'desc' : 'asc');
  }

  sortClassExamsBy(field: 'subject' | 'date') {
    if (this.classExamSortBySignal() === field) {
      this.classExamSortOrderSignal.set(this.classExamSortOrderSignal() === 'asc' ? 'desc' : 'asc');
    } else {
      this.classExamSortBySignal.set(field);
      this.classExamSortOrderSignal.set('asc');
    }
  }

  resetClassSummary() {
    this.selectedClassSignal.set(null);
    this.selectedSubjectSignal.set(null);
  }

  private parseClassNameParts(className: string): { grade: number; section: string } {
    const match = className.trim().match(/^(\d+)\s*([A-Za-zÇĞİÖŞÜçğıöşü]*)$/);
    const grade = match ? parseInt(match[1], 10) : 0;
    const sectionRaw = match && match[2] ? match[2] : '';
    const section = sectionRaw.toUpperCase();
    return { grade, section };
  }

  private parseTurkishDate(dateStr: string): Date {
    const months: { [key: string]: number } = {
      'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
      'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
    };
    const parts = dateStr.split(' ');
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = new Date().getFullYear();
    return new Date(year, month, day);
  }
}
