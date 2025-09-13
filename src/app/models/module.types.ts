export type ModuleKey = 'ogrenciler' | 'sinif-ozet' | 'sinav-yukle' | 'siniflarim' | 'siniflar-dersler' | 'yuklemeler';

export type ExamType = 'Çoktan Seçmeli' | 'Açık Uçlu' | 'Karma';

export type UploadStatus = 'İşleniyor' | 'Tamamlandı';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type UploadTab = 'ozet' | 'sorular';

export interface OriginClassConfig {
  [key: string]: string;
}
