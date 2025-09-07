import { 
  Component, 
  Input, 
  Output,
  EventEmitter,
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  AfterViewInit,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../../services/core/scroll.service';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Renk paleti sabitleri (brief'e göre kesinlikle bu renkler)
export const HERO_COLORS = {
  sage: '#a0bfb9',        // Ana sage rengi
  coolGray: '#c0cfd0',    // Cool gray
  lightGray: '#f5f5f5',   // Light gray
  white: '#ffffff',       // White
  warmGreen: '#80b48c'    // Warm green (accent/check)
} as const;

// Animation timeline sabitleri - Kağıt toplanma "Değerlendirme çok kolay" yazısıyla birlikte başlar
export const ANIMATION_TIMELINE = {
  dollyAndOrbit: { start: 0.00, end: 0.01 },    // Çok kısa (neredeyse yok)
  sweepTransition: { start: 0.01, end: 0.55 },  // Tarama geçişi (daha erken başlar)
  paperAlignment: { start: 0.48, end: 0.85 },   // Kağıt hizalama (0.48'de yazıyla birlikte başlar)
  circleAndCheck: { start: 0.85, end: 0.95 },   // Çember + check
  stabilize: { start: 0.95, end: 1.00 }         // Sabitlenme
} as const;

// Hikaye metinleri - 1. yazı uzatıldı, 2. yazı kısaltıldı, duplikasyon düzeltildi
export const STORY_TEXTS = [
  {
    text: "Onlarca kağıdı okumak çok yorucu...",
    start: 0.00,
    end: 0.20,
    type: 'problem' as const
  },
  {
    text: "Öğretmen her öğrenciye yetişemiyor.",
    start: 0.25,
    end: 0.45,
    type: 'challenge' as const
  },
  {
    text: "Değerlendirme artık çok kolay!",
    start: 0.48,
    end: 0.70,
    type: 'solution' as const
  },
  {
    text: "Öğrenci öğreniyor, öğretmen rahatlıyor!",
    start: 0.73,
    end: 1.00,
    type: 'success' as const
  }
] as const;

// Sahne-2 sabitleri - Folder sahnesi
const SCENE2_TIMELINE = {
  folderEnter: { start: 0.00, end: 0.36 },      // Dosya sağdan girer, kapak 55°→30°
  papersIntoFolder: { start: 0.36, end: 0.64 }, // Kağıtlar clip içinde dosyaya kayar
  folderClose: { start: 0.64, end: 0.82 },      // Kapak 30°→0° kapanır
  folderCenter: { start: 0.82, end: 0.96 },     // Dosya merkeze easeOutBack ile oturur
  transferCheck: { start: 0.96, end: 1.00 }     // Tik kağıttan kapağa cross-fade
} as const;

// Folder renk paleti (kraft kahverengi)
const FOLDER_COLORS = {
  body: '#C69C6D',       // Gövde
  stroke: '#8B5E3C',     // Kenar
  slot: '#A87C4F',       // İç slot
  highlight: '#E0C29A',  // Highlight
  shadow: 'rgba(0,0,0,0.08)' // Gölge
} as const;

// Yardımcı fonksiyonlar
const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const phase = (progress: number, start: number, end: number): number => clamp((progress - start) / (end - start), 0, 1);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

interface Paper {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  originalX: number;
  originalY: number;
  originalRotation: number;
  finalX: number;
  finalY: number;
  finalRotation: number;
  lines?: GraphiteLine[]; // Seed'li çizgiler (flicker önlemek için)
}

interface GraphiteLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Folder {
  x: number;
  y: number;
  w: number;
  h: number;
  openAngleDeg: number; // 0..55
  visible: boolean;
}

interface Scene2State {
  papersHidden: boolean; // folderClose bitince dış yığını çizme
  oldCheckAlpha: number; // 1 → 0 (kağıt üstü tik)
  newCheckAlpha: number; // 0 → 1 (kapak üstü tik)
}

@Component({
  selector: 'app-hero-scroll-scene',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroScrollSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroContainer', { static: true }) heroContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('videoElement', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement?: ElementRef<HTMLCanvasElement>;

  // Input properties
  @Input() videoSrcMp4?: string;
  @Input() videoSrcWebm?: string;
  @Input() posterSrc?: string = 'assets/poster.svg';
  @Input() scrollLengthPx: number = 2500;
  @Input() durationSec: number = 8;
  @Input() pin: boolean = true;
  @Input() colors = HERO_COLORS;

  // Output events
  @Output() ctaPrimaryClick = new EventEmitter<void>();
  @Output() ctaSecondaryClick = new EventEmitter<void>();
  @Output() pricingClick = new EventEmitter<void>();
  @Output() featuresClick = new EventEmitter<void>();
  @Output() contactClick = new EventEmitter<void>();
  @Output() docsClick = new EventEmitter<void>();

  // Internal state
  private scrollTrigger?: ScrollTrigger;
  private scrollTrigger2?: ScrollTrigger;
  private animationFrame?: number;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private papers: Paper[] = [];
  private currentProgress = 0;
  private devicePixelRatio = 1;
  
  // Scene state
  private folder?: Folder;
  private scene2: Scene2State = { 
    papersHidden: false, 
    oldCheckAlpha: 1, 
    newCheckAlpha: 0 
  };
  private scene1Progress = 0;
  private scene2Progress = 0;
  
  // Elements
  private folderSceneTriggerEl?: HTMLElement;

  // Signals
  private mode = signal<'video' | 'canvas'>('canvas');
  private isVideoReady = signal(false);
  public currentFrame = signal(0);

  // Computed
  useVideoMode = computed(() => 
    this.mode() === 'video' && this.isVideoReady() && !this.scrollService.isReducedMotion
  );

  constructor(public scrollService: ScrollService) {
    // Device pixel ratio'yu al (retina displays için)
    if (typeof window !== 'undefined') {
      this.devicePixelRatio = window.devicePixelRatio || 1;
    }
  }

  ngOnInit(): void {
    // Video source varsa video moduna geç
    if (this.videoSrcMp4 || this.videoSrcWebm) {
      this.mode.set('video');
    }
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.setupScene();
      // Scene 2 tamamen kaldırıldı - Scene 1 yeterli!
    } catch (error) {
      console.error('❌ Hero kurulumunda hata:', error);
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async setupScene(): Promise<void> {
    if (this.scrollService.isReducedMotion) {
      this.setupStaticFallback();
      return;
    }

    if (this.mode() === 'video') {
      await this.setupVideoMode();
    }
    
    // Video başarısız olursa veya hiç video yoksa Canvas moduna geç
    if (!this.useVideoMode()) {
      this.setupCanvasMode();
    }

    this.createScrollTrigger();
  }

  private async setupVideoMode(): Promise<void> {
    if (!this.videoElement?.nativeElement) return;

    const video = this.videoElement.nativeElement;
    
    return new Promise((resolve) => {
      const onVideoReady = () => {
        video.removeEventListener('loadedmetadata', onVideoReady);
        video.removeEventListener('error', onVideoError);
        
        // iOS uyumluluğu için
        video.muted = true;
        video.playsInline = true;
        
        // Video'yu başlangıç pozisyonunda durdur
        video.currentTime = 0;
        video.pause();
        
        this.isVideoReady.set(true);
        resolve();
      };

      const onVideoError = () => {
        video.removeEventListener('loadedmetadata', onVideoReady);
        video.removeEventListener('error', onVideoError);
        
        console.warn('Video yükleme hatası, Canvas moduna geçiliyor');
        this.mode.set('canvas');
        resolve();
      };

      video.addEventListener('loadedmetadata', onVideoReady);
      video.addEventListener('error', onVideoError);

      // Video source'ları yükle
      if (this.videoSrcWebm) {
        const sourceWebm = document.createElement('source');
        sourceWebm.src = this.videoSrcWebm;
        sourceWebm.type = 'video/webm';
        video.appendChild(sourceWebm);
      }

      if (this.videoSrcMp4) {
        const sourceMp4 = document.createElement('source');
        sourceMp4.src = this.videoSrcMp4;
        sourceMp4.type = 'video/mp4';
        video.appendChild(sourceMp4);
      }

      video.load();

      // Timeout fallback
      setTimeout(() => {
        if (!this.isVideoReady()) {
          onVideoError();
        }
      }, 5000);
    });
  }

  private setupCanvasMode(): void {
    if (!this.canvasElement?.nativeElement) return;

    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d') || undefined;

    if (!this.ctx) return;

    this.resizeCanvas();
    this.initializePapers();
    this.renderFrame(0);

    // Window resize listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.ctx) return;

    const container = this.heroContainer.nativeElement;
    const rect = container.getBoundingClientRect();

    // Canvas boyutlarını container'a göre ayarla
    this.canvas.width = rect.width * this.devicePixelRatio;
    this.canvas.height = rect.height * this.devicePixelRatio;
    
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    // Context'i scale et (retina support)
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);

    // Papers'ı yeniden hesapla ve grafit çizgileri yenile
    this.papers.forEach((paper, index) => {
      paper.lines = this.generateGraphiteLines(paper, index);
    });

    // Folder'ı yeniden hesapla
    if (this.folder) {
      this.initializeFolder();
    }

    // Yeniden render et
    this.renderFrame(this.currentProgress);
  }

  private initializePapers(): void {
    if (!this.canvas) return;

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;

    // 4-6 kağıt oluştur
    this.papers = [];
    const paperCount = 5;
    
    for (let i = 0; i < paperCount; i++) {
      const paper: Paper = {
        width: 120 + Math.random() * 40,  // A4 proportions scaled
        height: 160 + Math.random() * 50,
        x: 0, y: 0, rotation: 0,
        originalX: canvasWidth * 0.55 + Math.random() * canvasWidth * 0.25, // Dağınık kağıtlar daha sağda (0.45 -> 0.55)
        originalY: canvasHeight * 0.45 + Math.random() * canvasHeight * 0.3, // Çok az yukarı (0.5 -> 0.45)
        originalRotation: (Math.random() - 0.5) * 30, // -15 to +15 degrees
        finalX: canvasWidth * 0.65 + i * 2, // Toplanmış hali biraz sola (0.7 -> 0.65)
        finalY: canvasHeight * 0.55 + i * 1, // Çok az yukarı (0.6 -> 0.55)
        finalRotation: i * 0.5 // Slight offset in stack
      };

      // Initial position
      paper.x = paper.originalX;
      paper.y = paper.originalY;
      paper.rotation = paper.originalRotation;

      // Seed'li grafit çizgiler oluştur (flicker önlemek için)
      paper.lines = this.generateGraphiteLines(paper, i);

      this.papers.push(paper);
    }
  }

  private generateGraphiteLines(paper: Paper, seed: number): GraphiteLine[] {
    // Seed'li RNG için simple hash function
    const seededRandom = (s: number) => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };

    const lines: GraphiteLine[] = [];
    let currentSeed = seed * 12345 + 67890; // Initial seed

    const lineCount = 3 + Math.floor(seededRandom(currentSeed++) * 3); // 3-5 lines
    
    // Kağıt sınırları (kenar boşlukları ile)
    const leftBound = -paper.width / 2 + 15;
    const rightBound = paper.width / 2 - 15;
    const topBound = -paper.height / 2 + 15;
    const bottomBound = paper.height / 2 - 15;
    
    for (let i = 0; i < lineCount; i++) {
      const lineY = topBound + (i * 25);
      
      // Y pozisyonu kağıt sınırları içinde mi kontrol et
      if (lineY > bottomBound) break;
      
      // X pozisyonları kağıt içinde kalacak şekilde hesapla
      const availableWidth = rightBound - leftBound;
      const minLineLength = 30;
      const maxLineLength = Math.min(80, availableWidth - 20);
      
      const startX = leftBound + seededRandom(currentSeed++) * (availableWidth - maxLineLength);
      const lineLength = minLineLength + seededRandom(currentSeed++) * (maxLineLength - minLineLength);
      const endX = startX + lineLength;
      
      lines.push({
        startX: startX,
        startY: lineY,
        endX: endX,
        endY: lineY
      });
    }

    return lines;
  }

  private createScrollTrigger(): void {
    this.scrollTrigger = this.scrollService.createScrollScene({
      trigger: this.heroContainer.nativeElement,
      start: 'top top',
      end: `+=${this.scrollLengthPx}`,
      pin: this.pin,
      scrub: true,
      onUpdate: (progress: number) => {
        this.onScene1Update(progress);
      }
    });
  }

  private onScrollProgress(progress: number): void {
    this.currentProgress = progress;

    if (this.useVideoMode()) {
      this.updateVideoFrame(progress);
    } else {
      this.scheduleRender(progress);
    }
  }

  private updateVideoFrame(progress: number): void {
    if (!this.videoElement?.nativeElement || !this.isVideoReady()) return;

    const video = this.videoElement.nativeElement;
    const targetTime = this.durationSec * progress;
    
    // Smooth video scrubbing
    if (Math.abs(video.currentTime - targetTime) > 0.1) {
      video.currentTime = targetTime;
    }
  }

  private scheduleRender(progress: number): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.renderFrame(progress);
    });
  }

  private renderFrame(progress: number): void {
    if (!this.ctx || !this.canvas) return;

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;

    // Clear canvas
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, this.colors.white);
    gradient.addColorStop(1, this.colors.lightGray);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Sadece Scene 1 - basit ve güvenilir
    this.renderScene1(progress, canvasWidth, canvasHeight);
  }

  private renderScene1(progress: number, canvasWidth: number, canvasHeight: number): void {
    if (!this.ctx) return;

    // Timeline hesaplamaları
    const timeline = ANIMATION_TIMELINE;

    // Dolly animasyonu devre dışı - direkt tam yaklaşmış başlar
    let cameraScale = 1; // Her zaman tam yaklaşmış
    let cameraRotation = 0; // Döndürme yok

    // Canvas transform uygula (sadece sabit transform)
    this.ctx.save();
    this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
    this.ctx.scale(cameraScale, cameraScale);
    this.ctx.rotate(cameraRotation * Math.PI / 180);
    this.ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // 0.01-0.55: Sweep transition
    let sweepX = -100;
    if (progress >= timeline.sweepTransition.start && progress <= timeline.sweepTransition.end) {
      const sweepProgress = (progress - timeline.sweepTransition.start) / 
                           (timeline.sweepTransition.end - timeline.sweepTransition.start);
      sweepX = this.scrollService.interpolate(-100, canvasWidth + 100, sweepProgress);
    }

    // Papers render
    this.papers.forEach((paper, index) => {
      this.ctx!.save();

      // 0.55-0.80: Paper alignment
      let paperX = paper.originalX;
      let paperY = paper.originalY;
      let paperRotation = paper.originalRotation;

      if (progress >= timeline.paperAlignment.start && progress <= timeline.paperAlignment.end) {
        const alignProgress = (progress - timeline.paperAlignment.start) / 
                             (timeline.paperAlignment.end - timeline.paperAlignment.start);
        // Daha yumuşak geçiş için easeInOutCubic kullan (easeOutQuart yerine)
        const easedProgress = this.scrollService.easing.easeInOutCubic(alignProgress);
        
        paperX = this.scrollService.interpolate(paper.originalX, paper.finalX, easedProgress);
        paperY = this.scrollService.interpolate(paper.originalY, paper.finalY, easedProgress);
        paperRotation = this.scrollService.interpolate(paper.originalRotation, paper.finalRotation, easedProgress);
      } else if (progress > timeline.paperAlignment.end) {
        paperX = paper.finalX;
        paperY = paper.finalY;
        paperRotation = paper.finalRotation;
      }

      // Sweep effect'den etkilenme
      if (progress >= timeline.sweepTransition.start && progress <= timeline.sweepTransition.end) {
        const distanceFromSweep = Math.abs(paperX - sweepX);
        if (distanceFromSweep < 150) { // Sweep radius
          const influence = 1 - (distanceFromSweep / 150);
          const organizeAmount = influence * 0.3;
          
          paperRotation *= (1 - organizeAmount);
          paperX += Math.sin(paperRotation * Math.PI / 180) * organizeAmount * 10;
        }
      }

      // Paper çiz
      this.ctx!.translate(paperX, paperY);
      this.ctx!.rotate(paperRotation * Math.PI / 180);

      // Paper shadow
      this.ctx!.shadowColor = 'rgba(0, 0, 0, 0.1)';
      this.ctx!.shadowOffsetX = 2;
      this.ctx!.shadowOffsetY = 4;
      this.ctx!.shadowBlur = 8;

      // Paper background
      this.ctx!.fillStyle = this.colors.white;
      this.ctx!.fillRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);

      // Paper border
      this.ctx!.strokeStyle = this.colors.coolGray;
      this.ctx!.lineWidth = 1;
      this.ctx!.strokeRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);

      // Grafit çizgiler (okunmaz) - progress ile kademeli görünüm
      this.drawGraphiteLines(paper, progress);

      this.ctx!.restore();
    });

    // Sweep gradient overlay
    if (progress >= timeline.sweepTransition.start && progress <= timeline.sweepTransition.end) {
      this.drawSweepGradient(sweepX);
    }

    // 0.80-0.92: Circle + checkmark
    if (progress >= timeline.circleAndCheck.start) {
      this.drawCircleAndCheck(progress);
    }

    // Akan hikaye metinleri (kağıtların üstünde)
    this.drawStoryText(progress, canvasWidth, canvasHeight);

    this.ctx.restore();
  }

  private renderScene2(canvasWidth: number, canvasHeight: number): void {
    if (!this.ctx || !this.folder) return;

    this.ctx.save();
    this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
    this.ctx.scale(1, 1);
    this.ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // Z-order kritik - doğru sırayla çiz:
    // 1. Dış yığın (papers) - Scene2 başlangıcında alpha değişiyor
    if (!this.scene2.papersHidden) {
      this.drawOuterPaperStack(canvasWidth, canvasHeight);
    }

    // 2. Folder base (gövde + iç slot + gölge)
    if (this.folder.visible) {
      this.drawFolderBase(this.folder);
    }

    // 3. Papers entering (clip içinde içeri kayan kağıt kopyası)
    if (this.folder.visible && this.scene2Progress >= SCENE2_TIMELINE.papersIntoFolder.start) {
      this.drawPapersEntering(this.folder);
    }

    // 4. Folder flap (üst kapak - menteşeden dönen trapez)
    if (this.folder.visible) {
      this.drawFolderFlap(this.folder);
    }

    // 5. Transferred check (cross-fade tikler)
    this.drawTransferredCheck(this.folder);

    this.ctx.restore();
  }

  private drawOuterPaperStack(canvasWidth: number, canvasHeight: number): void {
    if (!this.ctx) return;

    const timeline = SCENE2_TIMELINE;
    let stackAlpha = 1;

    // papersIntoFolder sırasında alpha 1→0.6
    if (this.scene2Progress >= timeline.papersIntoFolder.start && 
        this.scene2Progress <= timeline.papersIntoFolder.end) {
      const t = phase(this.scene2Progress, timeline.papersIntoFolder.start, timeline.papersIntoFolder.end);
      stackAlpha = lerp(1, 0.6, t);
    }
    // folderClose sırasında alpha 0.6→0.0
    else if (this.scene2Progress >= timeline.folderClose.start && 
             this.scene2Progress <= timeline.folderClose.end) {
      const t = phase(this.scene2Progress, timeline.folderClose.start, timeline.folderClose.end);
      stackAlpha = lerp(0.6, 0, t);
    }

    this.ctx.globalAlpha = stackAlpha;

    // Final pozisyondaki kağıtları çiz (Scene1'in sonundaki hali)
    this.papers.forEach((paper, index) => {
      this.ctx!.save();

      this.ctx!.translate(paper.finalX, paper.finalY);
      this.ctx!.rotate(paper.finalRotation * Math.PI / 180);

      // Paper shadow
      this.ctx!.shadowColor = 'rgba(0, 0, 0, 0.1)';
      this.ctx!.shadowOffsetX = 2;
      this.ctx!.shadowOffsetY = 4;
      this.ctx!.shadowBlur = 8;

      // Paper background
      this.ctx!.fillStyle = this.colors.white;
      this.ctx!.fillRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);

      // Paper border
      this.ctx!.strokeStyle = this.colors.coolGray;
      this.ctx!.lineWidth = 1;
      this.ctx!.strokeRect(-paper.width / 2, -paper.height / 2, paper.width, paper.height);

      // Grafit çizgiler
      this.drawGraphiteLines(paper, 1); // Final opacity

      this.ctx!.restore();
    });

    this.ctx.globalAlpha = 1;
  }

  private drawFolderBase(folder: Folder): void {
    if (!this.ctx) return;

    this.ctx.save();

    const slotHeight = folder.h * 0.45;
    const padX = folder.w * 0.06;

    // Folder shadow
    this.ctx.shadowColor = FOLDER_COLORS.shadow;
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 6;
    this.ctx.shadowBlur = 12;

    // Main body
    this.ctx.fillStyle = FOLDER_COLORS.body;
    this.ctx.strokeStyle = FOLDER_COLORS.stroke;
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(folder.x - folder.w/2, folder.y - folder.h/2, folder.w, folder.h);
    this.ctx.strokeRect(folder.x - folder.w/2, folder.y - folder.h/2, folder.w, folder.h);

    // Inner slot (kağıtlar için alan)
    this.ctx.shadowColor = 'transparent';
    this.ctx.fillStyle = FOLDER_COLORS.slot;
    this.ctx.fillRect(
      folder.x - folder.w/2 + padX, 
      folder.y - slotHeight/2, 
      folder.w - 2*padX, 
      slotHeight
    );
    this.ctx.strokeRect(
      folder.x - folder.w/2 + padX, 
      folder.y - slotHeight/2, 
      folder.w - 2*padX, 
      slotHeight
    );

    this.ctx.restore();
  }

  private drawPapersEntering(folder: Folder): void {
    if (!this.ctx) return;

    const timeline = SCENE2_TIMELINE;
    if (this.scene2Progress < timeline.papersIntoFolder.start || 
        this.scene2Progress > timeline.papersIntoFolder.end) return;

    const t = phase(this.scene2Progress, timeline.papersIntoFolder.start, timeline.papersIntoFolder.end);
    const easedT = this.scrollService.easing.easeInCubic(t);

    this.ctx.save();

    // Clip alanı (kağıtların "içeri girişi")
    const slotHeight = folder.h * 0.45;
    const padX = folder.w * 0.06;
    const innerX = folder.x - folder.w/2 + padX;
    const innerY = folder.y - slotHeight/2;
    const innerW = folder.w - 2*padX;
    const innerH = slotHeight;

    this.ctx.beginPath();
    this.ctx.rect(innerX, innerY, innerW, innerH);
    this.ctx.clip();

    // Kağıt kopyasının hareketi
    const stackCenterX = this.canvas!.width / this.devicePixelRatio * 0.65;
    const stackCenterY = this.canvas!.height / this.devicePixelRatio * 0.55;
    const folderMouthX = innerX + innerW * 0.5;
    const folderMouthY = innerY + innerH * 0.55;

    const copyX = lerp(stackCenterX, folderMouthX, easedT);
    const copyY = lerp(stackCenterY, folderMouthY, easedT);
    const copyScale = lerp(1.0, 0.96, easedT);
    const copyAlpha = t; // 0 → 1

    this.ctx.globalAlpha = copyAlpha;
    this.ctx.scale(copyScale, copyScale);

    // Simplified paper stack kopyası
    this.papers.slice(0, 3).forEach((paper, index) => {
      this.ctx!.save();
      
      this.ctx!.translate(copyX + index * 2, copyY + index * 1);
      this.ctx!.rotate(paper.finalRotation * Math.PI / 180 * 0.5); // Daha az rotasyon

      this.ctx!.fillStyle = this.colors.white;
      this.ctx!.fillRect(-paper.width/2 * 0.8, -paper.height/2 * 0.8, paper.width * 0.8, paper.height * 0.8);
      
      this.ctx!.strokeStyle = this.colors.coolGray;
      this.ctx!.lineWidth = 1;
      this.ctx!.strokeRect(-paper.width/2 * 0.8, -paper.height/2 * 0.8, paper.width * 0.8, paper.height * 0.8);

      this.ctx!.restore();
    });

    this.ctx.restore();
  }

  private drawFolderFlap(folder: Folder): void {
    if (!this.ctx) return;

    this.ctx.save();

    const slotHeight = folder.h * 0.45;
    const padX = folder.w * 0.06;
    
    // Menteşe noktası (hinge)
    const hingeX = folder.x - folder.w/2 + padX;
    const hingeY = folder.y - slotHeight/2;

    this.ctx.translate(hingeX, hingeY);
    this.ctx.rotate(-folder.openAngleDeg * Math.PI / 180);

    // Flap (trapez şekli)
    const flapWidth = folder.w - 2*padX;
    const flapHeight = folder.h * 0.3;

    this.ctx.fillStyle = FOLDER_COLORS.highlight;
    this.ctx.strokeStyle = FOLDER_COLORS.stroke;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(flapWidth, 0);
    this.ctx.lineTo(flapWidth * 0.9, -flapHeight);
    this.ctx.lineTo(flapWidth * 0.1, -flapHeight);
    this.ctx.closePath();
    
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawTransferredCheck(folder: Folder): void {
    if (!this.ctx) return;

    const timeline = SCENE2_TIMELINE;
    
    // Old check (kağıt üstü) - Scene2 başında görünür, transferCheck'te fade out
    const oldCheckAlpha = this.scene2.oldCheckAlpha;
    if (oldCheckAlpha > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = oldCheckAlpha;
      
      const stackCenterX = this.canvas!.width / this.devicePixelRatio * 0.65;
      const stackCenterY = this.canvas!.height / this.devicePixelRatio * 0.55;
      
      this.drawCheckMark(stackCenterX, stackCenterY);
      this.ctx.restore();
    }

    // New check (kapak üstü) - transferCheck'te fade in
    const newCheckAlpha = this.scene2.newCheckAlpha;
    if (newCheckAlpha > 0 && folder.visible) {
      this.ctx.save();
      this.ctx.globalAlpha = newCheckAlpha;
      
      const checkX = folder.x;
      const checkY = folder.y - folder.h * 0.18; // Kapağın üstünde
      
      this.drawCheckMark(checkX, checkY);
      this.ctx.restore();
    }
  }

  private drawCheckMark(x: number, y: number): void {
    if (!this.ctx) return;

    const checkSize = 8;
    
    this.ctx.strokeStyle = this.colors.warmGreen;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(x - checkSize, y);
    this.ctx.lineTo(x - checkSize / 3, y + checkSize / 2);
    this.ctx.lineTo(x + checkSize, y - checkSize / 2);
    this.ctx.stroke();
  }

  private drawGraphiteLines(paper: Paper, progress: number): void {
    if (!this.ctx || !paper.lines) return;

    // Yazıların görünürlük hesaplama - çok yavaş ve yumuşak değişim
    const timeline = ANIMATION_TIMELINE;
    let textOpacity = 0.4; // Başlangıçta %40 opacity ile görünür
    
    // Dolly orbit aşamasında (0.00-0.15) sabit görünürlük
    if (progress <= timeline.dollyAndOrbit.end) {
      textOpacity = 0.4;
    }
    // Sweep transition'da yazılar çok yavaşça koyulaşır (0.15-0.65 arası)
    else if (progress >= timeline.sweepTransition.start && progress <= timeline.sweepTransition.end) {
      const sweepProgress = (progress - timeline.sweepTransition.start) / 
                           (timeline.sweepTransition.end - timeline.sweepTransition.start);
      // Çok yumuşak geçiş - easing fonksiyonu ile
      const easedProgress = this.scrollService.easing.easeInOutCubic(sweepProgress);
      textOpacity = 0.4 + (easedProgress * 0.05); // %40'tan %45'e çık (çok yavaş)
    }
    // Paper alignment'ta yazılar biraz daha net görünür (0.65-0.90 arası)
    else if (progress >= timeline.paperAlignment.start) {
      const alignProgress = (progress - timeline.paperAlignment.start) / 
                           (timeline.paperAlignment.end - timeline.paperAlignment.start);
      // Yine yumuşak geçiş
      const easedProgress = this.scrollService.easing.easeInOutCubic(alignProgress);
      textOpacity = 0.45 + (easedProgress * 0.05); // %45'ten %50'ye çık (çok yavaş)
    }

    this.ctx.save();
    
    // Grafit rengi (sage/gray karışımı) - animasyonlu opacity
    this.ctx.strokeStyle = this.colors.coolGray;
    this.ctx.globalAlpha = textOpacity;
    this.ctx.lineWidth = 1;

    // Pre-generated çizgileri çiz (flicker yok)
    paper.lines.forEach(line => {
      this.ctx!.beginPath();
      this.ctx!.moveTo(line.startX, line.startY);
      this.ctx!.lineTo(line.endX, line.endY);
      this.ctx!.stroke();
    });

    this.ctx.restore();
  }

  private drawStoryText(progress: number, canvasWidth: number, canvasHeight: number): void {
    if (!this.ctx) return;

    // Aktif metinleri bul (progress'e göre) - İlk yazı için start'ı biraz toleranslı yap
    const activeTexts = STORY_TEXTS.filter((story) => {
      return progress >= (story.start - 0.001) && progress <= story.end;
    });

    if (activeTexts.length === 0) return;

    this.ctx.save();

    // Her aktif metin için
    activeTexts.forEach((story, index) => {
      // Orijinal story index'ini bul
      const originalIndex = STORY_TEXTS.findIndex(s => s.text === story.text);
      
      // Metin opacity hesaplama (fade in/out efekti)
      const textProgress = (progress - story.start) / (story.end - story.start);
      let opacity = 1;
      
      // Tüm yazılar için aynı fade in/out kuralları
      if (textProgress < 0) {
        opacity = 0; // Henüz başlamamış
      } else if (textProgress < 0.15) {
        opacity = textProgress / 0.15; // Fade in (ilk %15'te)
      } else if (textProgress > 0.85) {
        opacity = (1 - textProgress) / 0.15; // Fade out (son %15'te)
      } else {
        opacity = 1; // Tam görünür
      }

      // Tüm metinler için siyah bold stil
      const textColor: string = '#000000'; // Siyah
      const fontSize = 32; // Daha büyük font (24 -> 32)
      const fontWeight = '700'; // Bold

      // Font ayarları (null check ile güvenli)
      if (!this.ctx) return;
      
      this.ctx.font = `italic ${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
      this.ctx.fillStyle = textColor;
      this.ctx.globalAlpha = opacity;
      this.ctx.textAlign = 'center'; // Center align - kağıtları ortalayacak
      this.ctx.textBaseline = 'top';

      // Kağıtların merkez pozisyonunu hesapla (progress'e göre)
      let paperCenterX;
      if (progress < 0.48) {
        // Dağınık haldeyken: originalX aralığının merkezi (%55-80 arası = %67.5)
        paperCenterX = canvasWidth * 0.675;
      } else {
        // Toplanmış haldeyken: finalX pozisyonu (%65)
        paperCenterX = canvasWidth * 0.65;
      }

      // Metin pozisyonu (kağıtların merkezine göre)
      const textX = paperCenterX; // Yazıyı kağıt merkezine hizala
      const baseY = canvasHeight * 0.24; // Yazıları çok az yukarı aldı (%25 -> %23)
      const textY = baseY; // Tüm yazılar aynı Y pozisyonunda (üst üste)

      // Metin gölgesi (okunabilirlik için)
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 1;
      this.ctx.shadowBlur = 3;

      // Tek satırda göster - yazılar artık kısa
      this.ctx.fillText(story.text, textX, textY);
    });

    this.ctx.restore();
  }

  private drawWrappedText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    if (!this.ctx) return;

    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        // Satır çok uzun, mevcut satırı çiz ve yeni satıra geç
        this.ctx.fillText(line.trim(), x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    // Son satırı çiz
    if (line.trim().length > 0) {
      this.ctx.fillText(line.trim(), x, currentY);
    }
  }

  private drawPaperCheckMarks(paper: Paper, progress: number, index: number): void {
    if (!this.ctx) return;

    const timeline = ANIMATION_TIMELINE;
    
    // Mini check işaretleri sadece yazılar geçerken görünür
    if (progress < timeline.sweepTransition.start || progress > timeline.paperAlignment.end) return;

    // Her kağıt için farklı zamanlarda görünür
    const paperDelay = index * 0.1; // Her kağıt 0.1 gecikmeyle
    const adjustedProgress = Math.max(0, progress - paperDelay);
    
    if (adjustedProgress < timeline.sweepTransition.start) return;

    const checkOpacity = Math.min(0.4, (adjustedProgress - timeline.sweepTransition.start) * 2);

    this.ctx.save();

    // Check mark pozisyonu (kağıdın sağ üst köşesi)
    const checkX = paper.width / 2 - 8;
    const checkY = -paper.height / 2 + 8;
    const checkSize = 4;

    this.ctx.strokeStyle = this.colors.coolGray;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = checkOpacity;

    // Mini check çiz
    this.ctx.beginPath();
    this.ctx.moveTo(checkX - checkSize, checkY);
    this.ctx.lineTo(checkX - checkSize / 3, checkY + checkSize / 2);
    this.ctx.lineTo(checkX + checkSize, checkY - checkSize / 2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  private drawSweepGradient(sweepX: number): void {
    if (!this.ctx || !this.canvas) return;

    const canvasHeight = this.canvas.height / this.devicePixelRatio;
    
    this.ctx.save();
    
    // Gradient (emissive değil, sadece yumuşak geçiş)
    const sweepGradient = this.ctx.createLinearGradient(sweepX - 75, 0, sweepX + 75, 0);
    sweepGradient.addColorStop(0, 'transparent');
    sweepGradient.addColorStop(0.3, this.colors.sage + '20'); // %20 opacity
    sweepGradient.addColorStop(0.7, this.colors.coolGray + '15'); // %15 opacity
    sweepGradient.addColorStop(1, 'transparent');

    this.ctx.fillStyle = sweepGradient;
    this.ctx.fillRect(sweepX - 75, 0, 150, canvasHeight);

    this.ctx.restore();
  }

  private drawCircleAndCheck(progress: number): void {
    if (!this.ctx || !this.canvas) return;

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;
    
    const centerX = canvasWidth * 0.65; // Toplanmış kağıtlarla uyumlu pozisyon
    const centerY = canvasHeight * 0.55; // Kağıtlarla uyumlu yukarı taşındı
    const radius = 20;

    this.ctx.save();

    const timeline = ANIMATION_TIMELINE;
    const circleProgress = Math.min(1, Math.max(0, 
      (progress - timeline.circleAndCheck.start) / 
      (timeline.circleAndCheck.end - timeline.circleAndCheck.start)
    ));

    // Circle çiz (0 -> 1 progress ile)
    if (circleProgress > 0) {
      this.ctx.strokeStyle = this.colors.coolGray;
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round';

      const endAngle = circleProgress * Math.PI * 2;
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + endAngle);
      this.ctx.stroke();
    }

    // Checkmark çiz (circle tamamlandıktan sonra)
    const checkProgress = Math.max(0, (circleProgress - 0.7) / 0.3); // Son %30'da
    if (checkProgress > 0) {
      this.ctx.strokeStyle = this.colors.warmGreen;
      this.ctx.lineWidth = 3;
      
      // Check path
      const checkSize = 8;
      const checkPath = [
        { x: centerX - checkSize, y: centerY },
        { x: centerX - checkSize / 3, y: centerY + checkSize / 2 },
        { x: centerX + checkSize, y: centerY - checkSize / 2 }
      ];

      this.ctx.beginPath();
      this.ctx.moveTo(checkPath[0].x, checkPath[0].y);
      
      // İlk segment
      if (checkProgress > 0) {
        const segment1Progress = Math.min(1, checkProgress * 2);
        const x = this.scrollService.interpolate(checkPath[0].x, checkPath[1].x, segment1Progress);
        const y = this.scrollService.interpolate(checkPath[0].y, checkPath[1].y, segment1Progress);
        this.ctx.lineTo(x, y);
      }
      
      // İkinci segment
      if (checkProgress > 0.5) {
        const segment2Progress = Math.min(1, (checkProgress - 0.5) * 2);
        this.ctx.moveTo(checkPath[1].x, checkPath[1].y);
        const x = this.scrollService.interpolate(checkPath[1].x, checkPath[2].x, segment2Progress);
        const y = this.scrollService.interpolate(checkPath[1].y, checkPath[2].y, segment2Progress);
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private setupScene2(): void {
    if (typeof window === 'undefined' || !this.heroContainer?.nativeElement) return;
    
    try {
      // Sentinel element oluştur (Sahne-2 trigger)
      this.folderSceneTriggerEl = document.createElement('div');
      this.folderSceneTriggerEl.setAttribute('aria-hidden', 'true');
      this.folderSceneTriggerEl.setAttribute('role', 'presentation');
      this.folderSceneTriggerEl.style.cssText = 'height:1px;width:100%;';
      
      // Hero container'ın hemen altına ekle
      const parentEl = this.heroContainer.nativeElement.parentElement;
      if (parentEl) {
        parentEl.insertBefore(this.folderSceneTriggerEl, this.heroContainer.nativeElement.nextSibling);
      }

      // Viewport boyutuna göre scroll uzunluğu hesapla
      const viewportHeight = window.innerHeight;
      const SCENE2_SCROLL_PX = clamp(viewportHeight * 2.2, 1400, 1800);

      // İkinci ScrollTrigger kur
      this.scrollTrigger2 = this.scrollService.createScrollScene({
        trigger: this.folderSceneTriggerEl,
        start: 'top top',
        end: `+=${SCENE2_SCROLL_PX}`,
        pin: true,
        pinElement: this.heroContainer.nativeElement,
        scrub: 0.35,
        onUpdate: (progress: number) => this.onScene2Update(progress)
      });

      // Folder'ı başlat (canvas hazırsa)
      if (this.canvas) {
        this.initializeFolder();
      }
    } catch (error) {
      console.error('Scene 2 kurulum hatası:', error);
      // Scene 2 başarısız olsa bile Scene 1 çalışmaya devam etsin
    }
  }

  private initializeFolder(): void {
    if (!this.canvas) return;

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;
    
    const w = clamp(canvasWidth * 0.22, 220, 320);
    const h = w * 0.72;
    
    // Stack merkezi (mevcut kağıt merkezinden)
    const stackCenterX = canvasWidth * 0.65;
    const stackCenterY = canvasHeight * 0.55;

    this.folder = {
      x: canvasWidth + w * 0.6, // Başlangıçta sağda
      y: stackCenterY,
      w: w,
      h: h,
      openAngleDeg: 55, // Başlangıçta açık
      visible: false
    };
  }

  private onScene1Update(progress: number): void {
    this.scene1Progress = progress;
    this.scheduleRender(progress);
    // Scene 2 tamamen kaldırıldı - basit ve güvenilir!
  }

  private onScene2Update(progress: number): void {
    this.scene2Progress = progress;
    try {
      this.updateScene2State(progress);
    } catch (error) {
      console.error('Scene 2 update hatası:', error);
    }
    this.scheduleRender(this.scene1Progress); // Scene1 progress'i render için geç
  }

  private updateScene2State(progress: number): void {
    if (!this.folder) return;

    const timeline = SCENE2_TIMELINE;
    const canvasWidth = this.canvas!.width / this.devicePixelRatio;
    const stackCenterX = canvasWidth * 0.65;

    // folderEnter: dosya sağdan girer, kapak 55°→30°
    if (progress >= timeline.folderEnter.start && progress <= timeline.folderEnter.end) {
      const t = phase(progress, timeline.folderEnter.start, timeline.folderEnter.end);
      const easedT = this.scrollService.easing.easeOutCubic(t);
      
      const startX = canvasWidth + this.folder.w * 0.6;
      const dockX = stackCenterX + this.folder.w * 0.1;
      
      this.folder.x = lerp(startX, dockX, easedT);
      this.folder.openAngleDeg = lerp(55, 30, t);
      this.folder.visible = true;
    }

    // papersIntoFolder: dış yığın alpha 1→0.6
    // (Bu render'da handle edilecek)

    // folderClose: kapak 30°→0° kapanır; dış yığın 0.6→0.0
    if (progress >= timeline.folderClose.start && progress <= timeline.folderClose.end) {
      const t = phase(progress, timeline.folderClose.start, timeline.folderClose.end);
      const easedT = this.scrollService.easing.easeInOutCubic(t);
      
      this.folder.openAngleDeg = lerp(30, 0, easedT);
      
      // folderClose bitince dış yığını gizle
      if (t >= 1) {
        this.scene2.papersHidden = true;
      }
    }

    // folderCenter: dosya merkeze easeOutBack ile oturur
    if (progress >= timeline.folderCenter.start && progress <= timeline.folderCenter.end) {
      const t = phase(progress, timeline.folderCenter.start, timeline.folderCenter.end);
      const easedT = this.scrollService.easing.easeOutBack(t);
      
      const dockX = stackCenterX + this.folder.w * 0.1;
      const finalX = stackCenterX;
      
      this.folder.x = lerp(dockX, finalX, easedT);
    }

    // transferCheck: tik kağıttan kapağa cross-fade
    if (progress >= timeline.transferCheck.start && progress <= timeline.transferCheck.end) {
      const t = phase(progress, timeline.transferCheck.start, timeline.transferCheck.end);
      
      this.scene2.oldCheckAlpha = 1 - t;
      this.scene2.newCheckAlpha = t;
    }
  }

  private setupSequentialScene2(): void {
    console.log('🎭 Sequential Scene 2 kurulumu başlıyor...');
    
    if (typeof window === 'undefined' || !this.heroContainer?.nativeElement) return;

    try {
      // Sentinel element oluştur (görünmez)
      this.folderSceneTriggerEl = document.createElement('div');
      this.folderSceneTriggerEl.setAttribute('aria-hidden', 'true');
      this.folderSceneTriggerEl.setAttribute('role', 'presentation');
      this.folderSceneTriggerEl.style.cssText = 'height:1px;width:100%;'; // Görünmez
      
      // Hero container'ın hemen altına ekle
      const parentEl = this.heroContainer.nativeElement.parentElement;
      if (parentEl) {
        parentEl.insertBefore(this.folderSceneTriggerEl, this.heroContainer.nativeElement.nextSibling);
      }

      // Folder'ı initialize et
      if (this.canvas) {
        this.initializeFolder();
      }

      console.log('✅ Scene 2 hazır, Scene 1 bitimini bekliyor...');
    } catch (error) {
      console.error('❌ Sequential Scene 2 kurulum hatası:', error);
    }
  }

  private startScene2(): void {
    if (!this.folderSceneTriggerEl) return;

    console.log('🚀 Scene 2 başlatılıyor (Scene 1 bitti)...');

    try {
      const viewportHeight = window.innerHeight;
      const SCENE2_SCROLL_PX = clamp(viewportHeight * 2.2, 1400, 1800);

      // Şimdi güvenle pin edebiliriz (Scene 1'in pin'i artık yok)
      this.scrollTrigger2 = this.scrollService.createScrollScene({
        trigger: this.folderSceneTriggerEl,
        start: 'top top',
        end: `+=${SCENE2_SCROLL_PX}`,
        pin: true, // ✅ GÜVENLE PIN ET
        pinElement: this.heroContainer.nativeElement,
        scrub: 0.35,
        onUpdate: (progress: number) => this.onScene2Update(progress)
      });

      console.log('✅ Scene 2 ScrollTrigger aktif!');
    } catch (error) {
      console.error('❌ Scene 2 başlatma hatası:', error);
    }
  }

  private setupStaticFallback(): void {
    // Reduced motion durumunda statik poster göster
    console.log('Reduced motion detected, showing static fallback');
  }

  private cleanup(): void {
    if (this.scrollTrigger) {
      this.scrollService.killScrollTrigger(this.scrollTrigger);
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', () => this.resizeCanvas());
    }
  }
}
