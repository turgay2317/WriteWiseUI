import { Injectable, computed, signal } from '@angular/core';
import { UploadedExam, Question, UploadTab } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UploadedExamService {
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

  // Computed properties
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

  // Actions
  selectUploadedExam(exam: UploadedExam) {
    this.selectedUploadSignal.set(exam);
    this.uploadTabSignal.set(null);
    this.currentQuestionIdxSignal.set(0);
  }

  openUploadSection(tab: UploadTab) {
    this.uploadTabSignal.set(tab);
    if (tab === 'sorular') {
      this.currentQuestionIdxSignal.set(0);
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
}
