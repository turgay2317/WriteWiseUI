import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UploadedExam, Question, UploadTab } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ExamApiService {
  private readonly baseUrl = 'http://localhost:5000/api';
  // Uploaded exams data
  private uploadedExamsSignal = signal<UploadedExam[]>([
    { id: 'u1', title: 'Kasım Matematik', subject: 'Matematik', clazz: '4A', date: '2024-11-12', students: 28, status: 'Tamamlandı' },
    { id: 'u2', title: 'Aralık Türkçe', subject: 'Türkçe', clazz: '4B', date: '2024-12-04', students: 30, status: 'İşleniyor' },
    { id: 'u3', title: 'Ocak Fen', subject: 'Fen', clazz: '5A', date: '2025-01-15', students: 27, status: 'Tamamlandı' },
    { id: 'u4', title: 'Ekim Matematik', subject: 'Matematik', clazz: '5B', date: '2024-10-20', students: 25, status: 'Tamamlandı' },
    { id: 'u5', title: 'Kasım Fen', subject: 'Fen', clazz: '4A', date: '2024-11-25', students: 28, status: 'Tamamlandı' },
    { id: 'u6', title: 'Aralık Matematik', subject: 'Matematik', clazz: '6A', date: '2024-12-10', students: 32, status: 'İşleniyor' },
    { id: 'u7', title: 'Ocak Türkçe', subject: 'Türkçe', clazz: '5A', date: '2025-01-08', students: 27, status: 'Tamamlandı' },
    { id: 'u8', title: 'Şubat Fen', subject: 'Fen', clazz: '4B', date: '2025-02-12', students: 30, status: 'İşleniyor' },
    { id: 'u9', title: 'Mart Matematik', subject: 'Matematik', clazz: '5C', date: '2025-03-05', students: 29, status: 'Tamamlandı' },
    { id: 'u10', title: 'Nisan Türkçe', subject: 'Türkçe', clazz: '6B', date: '2025-04-15', students: 31, status: 'Tamamlandı' },
    { id: 'u11', title: 'Mayıs Fen', subject: 'Fen', clazz: '7A', date: '2025-05-20', students: 26, status: 'İşleniyor' },
    { id: 'u12', title: 'Haziran Matematik', subject: 'Matematik', clazz: '7B', date: '2025-06-10', students: 28, status: 'Tamamlandı' },
  ]);

  // Sorting for uploaded exams
  private uploadedSortBySignal = signal<'subject' | 'clazz' | 'date'>('date');
  private uploadedSortOrderSignal = signal<'asc' | 'desc'>('asc');

  // Questions data
  private uploadQuestionsMap: Record<string, Question[]> = {
    'u1': [
      { text: 'Aşağıdaki cümlelerin yazım yanlışlarını bulun.', groups: [ { count: 6, answers: ['de/da bitişik', 'büyük harf yanlış']}, { count: 4, answers: ['noktalama eksik', 'virgül hatası']} ], llmScore: 6, maxScore: 10, rationale: 'Kritik hataları doğru yakalayan kısmi yanıtlar.', teacherScore: 6 },
    ],
    'u2': [
      { text: 'Aşağıdakilerden hangisinin yazımı yanlıştır? Yanına doğrularını yazınız.', groups: [ { count: 8, answers: ['yanlış→yalnız', 'birşey→bir şey']}, { count: 5, answers: ['çoçuğu→çocuğu']} ], llmScore: 7, maxScore: 10, rationale: 'Çoğu doğru, kısmi eksikler mevcut.', teacherScore: 7 },
      { text: 'Cümlede anlatım bozukluğunu düzeltiniz.', groups: [ { count: 6, answers: ['özne-yüklem uyumsuzluğu']} ], llmScore: 6, maxScore: 10, rationale: 'Temel sorun tespiti doğru.', teacherScore: 6 },
    ],
    'u3': [
      { text: '1. soruya verilen cevapların yazımını değerlendiriniz.', groups: [ { count: 10, answers: ['-ki/-de ayrı yazımı'] } ], llmScore: 6, maxScore: 10, rationale: 'Genel doğruluk orta seviyede.', teacherScore: 6 },
      { text: 'Doğal olaylar ile ilgili kısa açıklama yazınız.', groups: [ { count: 7, answers: ['deprem örnekleri'] }, { count: 3, answers: ['yanlış terimler'] } ], llmScore: 5, maxScore: 10, rationale: 'Kavram hataları var.', teacherScore: 5 },
      { text: 'Basit elektrik devresini açıklayınız.', groups: [ { count: 12, answers: ['ampul, pil, anahtar'] } ], llmScore: 8, maxScore: 10, rationale: 'Doğru terimler çoğunlukta.', teacherScore: 8 },
    ]
  };

  // Selection signals  
  private selectedUploadSignal = signal<UploadedExam | null>(null);
  private uploadTabSignal = signal<UploadTab | null>(null);
  private currentQuestionIdxSignal = signal(0);
  private uploadProgressSignal = signal<number>(0);

  // Computed properties
  public sortedUploadedExams = computed(() => {
    const by = this.uploadedSortBySignal();
    const order = this.uploadedSortOrderSignal();
    const list = [...this.uploadedExamsSignal()];
    return list.sort((a, b) => {
      let cmp = 0;
      if (by === 'subject') {
        const av = (a.subject || '').toLowerCase();
        const bv = (b.subject || '').toLowerCase();
        if (av < bv) cmp = -1; else if (av > bv) cmp = 1; else cmp = 0;
      } else if (by === 'clazz') {
        const ap = this.parseClassNameParts(a.clazz || '');
        const bp = this.parseClassNameParts(b.clazz || '');
        if (ap.grade !== bp.grade) cmp = ap.grade < bp.grade ? -1 : 1;
        else if (ap.section !== bp.section) cmp = ap.section < bp.section ? -1 : 1;
        else cmp = 0;
      } else {
        const ad = new Date(a.date || 0).getTime();
        const bd = new Date(b.date || 0).getTime();
        if (ad < bd) cmp = -1; else if (ad > bd) cmp = 1; else cmp = 0;
      }
      return order === 'asc' ? cmp : -cmp;
    });
  });
  public currentQuestions = computed(() => {
    const upload = this.selectedUploadSignal();
    return upload ? (this.uploadQuestionsMap[upload.id] || []) : [];
  });

  public currentQuestion = computed(() => {
    const questions = this.currentQuestions();
    const idx = this.currentQuestionIdxSignal();
    return questions[idx] ?? null;
  });

  // Getters
  get uploadedExams() { return this.uploadedExamsSignal; }
  get selectedUpload() { return this.selectedUploadSignal; }
  get uploadTab() { return this.uploadTabSignal; }
  get currentQuestionIdx() { return this.currentQuestionIdxSignal; }
  get uploadProgress() { return this.uploadProgressSignal; }
  get uploadedSortBy() { return this.uploadedSortBySignal; }
  get uploadedSortOrder() { return this.uploadedSortOrderSignal; }

  // Actions
  selectUploadedExam(exam: UploadedExam) {
    this.selectedUploadSignal.set(exam);
    this.uploadTabSignal.set('sorular');
    this.currentQuestionIdxSignal.set(0);
  }

  openUploadSection(tab: UploadTab) {
    this.uploadTabSignal.set(tab);
    if (tab === 'sorular') {
      this.currentQuestionIdxSignal.set(0);
    }
  }

  sortUploadedBy(field: 'subject' | 'clazz' | 'date') {
    if (this.uploadedSortBySignal() === field) {
      this.uploadedSortOrderSignal.set(this.uploadedSortOrderSignal() === 'asc' ? 'desc' : 'asc');
    } else {
      this.uploadedSortBySignal.set(field);
      this.uploadedSortOrderSignal.set('asc');
    }
  }

  nextQuestion() {
    const length = this.currentQuestions().length;
    if (!length) return;
    this.currentQuestionIdxSignal.set(
      Math.min(this.currentQuestionIdxSignal() + 1, length - 1)
    );
  }

  prevQuestion() {
    const length = this.currentQuestions().length;
    if (!length) return;
    this.currentQuestionIdxSignal.set(
      Math.max(this.currentQuestionIdxSignal() - 1, 0)
    );
  }

  setTeacherScore(value: number) {
    const question = this.currentQuestion();
    const selectedUpload = this.selectedUploadSignal();
    if (!question || !selectedUpload) return;
    
    const questionList = this.uploadQuestionsMap[selectedUpload.id];
    const idx = this.currentQuestionIdxSignal();
    if (questionList && questionList[idx]) {
      questionList[idx].teacherScore = Math.max(0, Math.min(value, question.maxScore));
    }
  }

  adjustTeacherScore(delta: number) {
    const question = this.currentQuestion();
    if (!question) return;
    this.setTeacherScore((question.teacherScore || 0) + delta);
  }

  resetUploadedExams() {
    this.selectedUploadSignal.set(null);
    this.uploadTabSignal.set(null);
    this.currentQuestionIdxSignal.set(0);
  }

  private parseClassNameParts(className: string): { grade: number; section: string } {
    const match = className.trim().match(/^(\d+)\s*([A-Za-zÇĞİÖŞÜçğıöşü]*)$/);
    const grade = match ? parseInt(match[1], 10) : 0;
    const sectionRaw = match && match[2] ? match[2] : '';
    const section = sectionRaw.toUpperCase();
    return { grade, section };
  }

  constructor(private http: HttpClient) {}

  // Gerçek API çağrıları
  getSinav(sinavId: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}/sinav/${sinavId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  getSoru(sinavId: number, soruNo: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.get(`${this.baseUrl}/sinav/${sinavId}/soru/${soruNo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  updateCevapPuan(soruId: number, cevapId: number, puan: number): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.put(`${this.baseUrl}/soru/${soruId}/cevap/${cevapId}/puan`, 
      { puan: puan }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  updateAnalizDegerlendirme(analizId: number, pozitif: string, negatif: string): Observable<any> {
    const token = localStorage.getItem('jwt_token');
    return this.http.put(`${this.baseUrl}/analiz/${analizId}/degerlendirme`, 
      { pozitif: pozitif, negatif: negatif }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  analyzeUpload(params: {
    file: File;
    rules: string;
    subject: string;
    classes: string[];
    date: string; // ISO yyyy-MM-dd
  }): Observable<{ success: boolean; id?: string }> {
    const form = new FormData();
    form.append('file', params.file);
    form.append('rules', params.rules || '');
    form.append('subject', params.subject || '');
    form.append('classes', JSON.stringify(params.classes || []));
    form.append('date', params.date || '');

    const req = new HttpRequest('POST', `${this.baseUrl}/exams/analyze`, form, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map((event: HttpEvent<unknown>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = (event.total || 0);
          const loaded = (event.loaded || 0);
          const percent = total ? Math.round((loaded / total) * 100) : 0;
          this.uploadProgressSignal.set(percent);
          return { success: false };
        }
        if (event.type === HttpEventType.Response) {
          this.uploadProgressSignal.set(100);
          return { success: true, id: (event.body as any)?.id };
        }
        return { success: false };
      })
    );
  }
}
