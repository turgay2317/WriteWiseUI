export type ModuleKey = 'ogrenciler' | 'sinif-ozet' | 'sinav-yukle' | 'yuklemeler';

export type ExamType = 'Çoktan Seçmeli' | 'Açık Uçlu' | 'Karma';

export type UploadStatus = 'İşleniyor' | 'Tamamlandı';

export type ToastType = 'success' | 'error' | 'info';

export type UploadTab = 'ozet' | 'sorular';

export interface OriginClassConfig {
  [key: string]: string;
}
