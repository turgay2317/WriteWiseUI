import { Injectable, computed, signal } from '@angular/core';
import { ExamRow, Question } from '../../models';

@Injectable({ providedIn: 'root' })
export class StudentPortalService {
  // Student identity (mock)
  private studentNameSignal = signal<string>('Bertan');

  // Student-specific exams
  private myExamsSignal = signal<ExamRow[]>([
    { id: 'se1', date: '2025-01-12', subject: 'Türkçe', type: 'Açık Uçlu' as any, score: 82, copyProb: 6 },
    { id: 'se2', date: '2024-12-03', subject: 'Matematik', type: 'Karma' as any, score: 74, copyProb: 10 },
    { id: 'se3', date: '2024-11-20', subject: 'Fen', type: 'Çoktan Seçmeli' as any, score: 91, copyProb: 3 },
    { id: 'se4', date: '2025-02-05', subject: 'Tarih', type: 'Açık Uçlu' as any, score: 68, copyProb: 8 },
    { id: 'se5', date: '2025-02-18', subject: 'Coğrafya', type: 'Karma' as any, score: 77, copyProb: 5 },
    { id: 'se6', date: '2025-03-01', subject: 'Fizik', type: 'Açık Uçlu' as any, score: 88, copyProb: 4 },
    { id: 'se7', date: '2025-03-12', subject: 'Kimya', type: 'Çoktan Seçmeli' as any, score: 71, copyProb: 9 },
    { id: 'se8', date: '2025-03-25', subject: 'Biyoloji', type: 'Karma' as any, score: 79, copyProb: 7 },
    { id: 'se9', date: '2025-04-10', subject: 'Edebiyat', type: 'Açık Uçlu' as any, score: 85, copyProb: 6 },
    { id: 'se10', date: '2025-04-22', subject: 'İngilizce', type: 'Çoktan Seçmeli' as any, score: 90, copyProb: 2 },
  ]);

  // Map exam -> per-question feedback (mock)
  private examQuestionsMap: Record<string, Question[]> = {
    'se1': [
      { text: 'Yazım yanlışlarını düzeltiniz', groups: [], llmScore: 7, maxScore: 10, rationale: 'Büyük harf ve noktalama hataları kısmen düzeltildi.', teacherScore: 0 },
      { text: 'Paragrafın ana fikrini bulun', groups: [], llmScore: 10, maxScore: 10, rationale: 'Tam doğru.', teacherScore: 0 },
      { text: 'Eş anlamlı kelime örnekleri veriniz', groups: [], llmScore: 5, maxScore: 10, rationale: 'Örnekler eksik ve kısmen yanlış.', teacherScore: 0 },
      { text: 'Noktalama işaretleri uygulaması', groups: [], llmScore: 8, maxScore: 10, rationale: 'Birkaç eksik noktalama.', teacherScore: 0 },
      { text: 'Cümle türleri', groups: [], llmScore: 9, maxScore: 10, rationale: 'Genel olarak doğru.', teacherScore: 0 },
      { text: 'Fiilde çatı', groups: [], llmScore: 6, maxScore: 10, rationale: 'Tanımlar karışmış.', teacherScore: 0 },
      { text: 'Yazım kuralları', groups: [], llmScore: 7, maxScore: 10, rationale: 'Küçük imla hataları.', teacherScore: 0 },
      { text: 'Metin türleri', groups: [], llmScore: 8, maxScore: 10, rationale: 'Örnekler yeterli.', teacherScore: 0 },
      { text: 'Anlatım bozuklukları', groups: [], llmScore: 7, maxScore: 10, rationale: 'Bir iki yanlış tespit.', teacherScore: 0 },
      { text: 'Paragraf yorumu', groups: [], llmScore: 9, maxScore: 10, rationale: 'Sağlam gerekçe.', teacherScore: 0 },
    ],
    'se2': [
      { text: 'Çarpanlara ayırma', groups: [], llmScore: 8, maxScore: 10, rationale: 'Yöntem doğru, son adımda işlem hatası.', teacherScore: 0 },
      { text: 'Denklem çözümü', groups: [], llmScore: 6, maxScore: 10, rationale: 'Bazı ara adımlar eksik.', teacherScore: 0 },
      { text: 'Oran orantı', groups: [], llmScore: 7, maxScore: 10, rationale: 'Çözüm mantıklı, küçük hata.', teacherScore: 0 },
      { text: 'Fonksiyon grafikleri', groups: [], llmScore: 9, maxScore: 10, rationale: 'Doğru grafik ve yorum.', teacherScore: 0 },
      { text: 'Limit tanımı', groups: [], llmScore: 5, maxScore: 10, rationale: 'Tanım eksikleri.', teacherScore: 0 },
      { text: 'Türev uygulaması', groups: [], llmScore: 7, maxScore: 10, rationale: 'Kurallar doğru, işlem hatası.', teacherScore: 0 },
      { text: 'İntegral alan', groups: [], llmScore: 6, maxScore: 10, rationale: 'Sınırlar karışmış.', teacherScore: 0 },
      { text: 'Karmaşık sayılar', groups: [], llmScore: 8, maxScore: 10, rationale: 'Doğru yaklaşım.', teacherScore: 0 },
      { text: 'Olasılık', groups: [], llmScore: 9, maxScore: 10, rationale: 'Hesap doğru.', teacherScore: 0 },
      { text: 'Geometri açı', groups: [], llmScore: 7, maxScore: 10, rationale: 'Şekil okuma hatası.', teacherScore: 0 },
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


