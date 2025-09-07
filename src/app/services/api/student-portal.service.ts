import { Injectable, computed, signal } from '@angular/core';
import { ExamRow, Question } from '../../models';

@Injectable({ providedIn: 'root' })
export class StudentPortalService {
  // Student identity (mock)
  private studentNameSignal = signal<string>('Bertan');

  // Student-specific exams
  private myExamsSignal = signal<ExamRow[]>([
    { id: 'se1', date: '2025-01-12', subject: 'Türkçe', type: 'Açık Uçlu' as any, score: 82, copyProb: 6, maxScore: 100, averageScore: 75.5, copyText: '', totalQuestions: 10, ders_id: 1 },
    { id: 'se2', date: '2024-12-03', subject: 'Matematik', type: 'Karma' as any, score: 74, copyProb: 10, maxScore: 100, averageScore: 68.2, copyText: '', totalQuestions: 10, ders_id: 2 },
    { id: 'se3', date: '2024-11-20', subject: 'Fen', type: 'Çoktan Seçmeli' as any, score: 91, copyProb: 3, maxScore: 100, averageScore: 82.1, copyText: '', totalQuestions: 10, ders_id: 3 },
    { id: 'se4', date: '2025-02-05', subject: 'Tarih', type: 'Açık Uçlu' as any, score: 68, copyProb: 8, maxScore: 100, averageScore: 72.3, copyText: '', totalQuestions: 10, ders_id: 4 },
    { id: 'se5', date: '2025-02-18', subject: 'Coğrafya', type: 'Karma' as any, score: 77, copyProb: 5, maxScore: 100, averageScore: 71.8, copyText: '', totalQuestions: 10, ders_id: 5 },
    { id: 'se6', date: '2025-03-01', subject: 'Fizik', type: 'Açık Uçlu' as any, score: 88, copyProb: 4, maxScore: 100, averageScore: 79.6, copyText: '', totalQuestions: 10, ders_id: 6 },
    { id: 'se7', date: '2025-03-12', subject: 'Kimya', type: 'Çoktan Seçmeli' as any, score: 71, copyProb: 9, maxScore: 100, averageScore: 65.4, copyText: '', totalQuestions: 10, ders_id: 7 },
    { id: 'se8', date: '2025-03-25', subject: 'Biyoloji', type: 'Karma' as any, score: 79, copyProb: 7, maxScore: 100, averageScore: 73.9, copyText: '', totalQuestions: 10, ders_id: 8 },
    { id: 'se9', date: '2025-04-10', subject: 'Edebiyat', type: 'Açık Uçlu' as any, score: 85, copyProb: 6, maxScore: 100, averageScore: 78.2, copyText: '', totalQuestions: 10, ders_id: 9 },
    { id: 'se10', date: '2025-04-22', subject: 'İngilizce', type: 'Çoktan Seçmeli' as any, score: 90, copyProb: 2, maxScore: 100, averageScore: 84.7, copyText: '', totalQuestions: 10, ders_id: 10 },
  ]);

  // Map exam -> per-question feedback (mock)
  private examQuestionsMap: Record<string, any[]> = {
    'se1': [
      { 
        text: 'Yazım yanlışlarını düzeltiniz', 
        groups: [], 
        llmScore: 7, 
        maxScore: 10, 
        rationale: 'Büyük harf ve noktalama hataları kısmen düzeltildi.', 
        teacherScore: 0,
        studentAnswer: 'Büyük harfler doğru kullanılmış, ancak noktalama işaretlerinde bazı hatalar var.',
        positiveAnalysis: 'Yazım kurallarını genel olarak doğru uygulamışsınız. Büyük harf kullanımı başarılı.',
        negativeAnalysis: 'Noktalama işaretlerinde daha dikkatli olmalısınız. Virgül ve nokta kullanımını gözden geçirin.'
      },
      { 
        text: 'Paragrafın ana fikrini bulun', 
        groups: [], 
        llmScore: 10, 
        maxScore: 10, 
        rationale: 'Tam doğru.', 
        teacherScore: 0,
        studentAnswer: 'Paragrafın ana fikri, teknolojinin eğitimdeki rolü ve öğrenme süreçlerine etkisidir.',
        positiveAnalysis: 'Ana fikri mükemmel şekilde tespit etmişsiniz. Metni çok iyi anlamışsınız.',
        negativeAnalysis: null
      },
      { 
        text: 'Eş anlamlı kelime örnekleri veriniz', 
        groups: [], 
        llmScore: 5, 
        maxScore: 10, 
        rationale: 'Örnekler eksik ve kısmen yanlış.', 
        teacherScore: 0,
        studentAnswer: 'Güzel - hoş, büyük - iri',
        positiveAnalysis: 'Doğru örnekler vermişsiniz.',
        negativeAnalysis: 'Daha fazla örnek vermeniz gerekiyor. Eş anlamlı kelime dağarcığınızı genişletin.'
      },
      { 
        text: 'Noktalama işaretleri uygulaması', 
        groups: [], 
        llmScore: 8, 
        maxScore: 10, 
        rationale: 'Birkaç eksik noktalama.', 
        teacherScore: 0,
        studentAnswer: 'Merhaba, nasılsın? İyi misin!',
        positiveAnalysis: 'Noktalama işaretlerini genel olarak doğru kullanmışsınız.',
        negativeAnalysis: 'Bazı yerlerde virgül kullanımını kaçırmışsınız. Daha dikkatli olun.'
      },
      { 
        text: 'Cümle türleri', 
        groups: [], 
        llmScore: 9, 
        maxScore: 10, 
        rationale: 'Genel olarak doğru.', 
        teacherScore: 0,
        studentAnswer: 'Basit cümle: "Kitap okudum." Birleşik cümle: "Kitap okudum ve çok beğendim."',
        positiveAnalysis: 'Cümle türlerini çok iyi ayırt etmişsiniz. Örnekler açıklayıcı.',
        negativeAnalysis: 'Küçük bir detay eksik: sıralı cümle örneği de verebilirdiniz.'
      }
    ],
    'se2': [
      { 
        text: 'Çarpanlara ayırma', 
        groups: [], 
        llmScore: 8, 
        maxScore: 10, 
        rationale: 'Yöntem doğru, son adımda işlem hatası.', 
        teacherScore: 0,
        studentAnswer: 'x² + 5x + 6 = (x + 2)(x + 3)',
        positiveAnalysis: 'Çarpanlara ayırma yöntemini doğru uygulamışsınız.',
        negativeAnalysis: 'Son adımda işlem hatası yapmışsınız. Kontrol edin.'
      },
      { 
        text: 'Denklem çözümü', 
        groups: [], 
        llmScore: 6, 
        maxScore: 10, 
        rationale: 'Bazı ara adımlar eksik.', 
        teacherScore: 0,
        studentAnswer: '2x + 3 = 7, x = 2',
        positiveAnalysis: 'Sonuç doğru.',
        negativeAnalysis: 'Ara adımları göstermeniz gerekiyor. Çözüm sürecini detaylandırın.'
      }
    ],
    'se3': [
      { text: 'Elektrik devresi', groups: [], llmScore: 9, maxScore: 10, rationale: 'Doğru şema, açıklamada küçük eksik.', teacherScore: 0 },
      { text: 'Canlıların sınıflandırılması', groups: [], llmScore: 10, maxScore: 10, rationale: 'Tam doğru.', teacherScore: 0 },
      { text: 'Maddenin halleri', groups: [], llmScore: 8, maxScore: 10, rationale: 'İyi açıklama.', teacherScore: 0 },
      { text: 'Fotosentez', groups: [], llmScore: 7, maxScore: 10, rationale: 'Bazı kavramlar karışık.', teacherScore: 0 },
      { text: 'Hücresel solunum', groups: [], llmScore: 6, maxScore: 10, rationale: 'Şema eksikleri.', teacherScore: 0 },
      { text: 'Ekosistem', groups: [], llmScore: 9, maxScore: 10, rationale: 'Doğru örnekler.', teacherScore: 0 },
      { text: 'Isı ve sıcaklık', groups: [], llmScore: 8, maxScore: 10, rationale: 'Doğru hesap.', teacherScore: 0 },
      { text: 'Basit makineler', groups: [], llmScore: 7, maxScore: 10, rationale: 'Örnek yetersiz.', teacherScore: 0 },
      { text: 'Dolaşım sistemi', groups: [], llmScore: 9, maxScore: 10, rationale: 'Açıklama güçlü.', teacherScore: 0 },
      { text: 'Sindirim sistemi', groups: [], llmScore: 8, maxScore: 10, rationale: 'Genel doğruluk.', teacherScore: 0 },
    ],
    'se4': new Array(10).fill(0).map((_,i)=>({ text: `Tarih sorusu ${i+1}`, groups: [], llmScore: 6 + (i%5), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se5': new Array(10).fill(0).map((_,i)=>({ text: `Coğrafya sorusu ${i+1}`, groups: [], llmScore: 5 + (i%6), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se6': new Array(10).fill(0).map((_,i)=>({ text: `Fizik sorusu ${i+1}`, groups: [], llmScore: 7 + (i%3), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se7': new Array(10).fill(0).map((_,i)=>({ text: `Kimya sorusu ${i+1}`, groups: [], llmScore: 6 + (i%4), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se8': new Array(10).fill(0).map((_,i)=>({ text: `Biyoloji sorusu ${i+1}`, groups: [], llmScore: 6 + (i%5), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se9': new Array(10).fill(0).map((_,i)=>({ text: `Edebiyat sorusu ${i+1}`, groups: [], llmScore: 7 + (i%3), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
    'se10': new Array(10).fill(0).map((_,i)=>({ text: `İngilizce sorusu ${i+1}`, groups: [], llmScore: 8 - (i%3), maxScore: 10, rationale: 'Kısa açıklama.', teacherScore: 0 })),
  };

  private selectedExamSignal = signal<ExamRow | null>(null);
  private activeSectionSignal = signal<'sinavlarim' | 'sonuclarim' | 'geri-bildirimlerim'>('sinavlarim');

  // Computed
  public myExams = computed(() => this.myExamsSignal());
  public selectedExam = computed(() => this.selectedExamSignal());
  public selectedExamQuestions = computed(() => {
    const sel = this.selectedExamSignal();
    return sel ? (this.examQuestionsMap[sel.id] || []) : [];
  });
  public studentName = computed(() => this.studentNameSignal());
  public activeSection = computed(() => this.activeSectionSignal());

  // Actions
  selectExam(exam: ExamRow) {
    this.selectedExamSignal.set(exam);
  }

  setActiveSection(section: 'sinavlarim' | 'sonuclarim' | 'geri-bildirimlerim') {
    this.activeSectionSignal.set(section);
  }
}


