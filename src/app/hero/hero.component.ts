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
import { ScrollService } from '../shared/scroll.service';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Renk paleti sabitleri (brief'e göre kesinlikle bu renkler)
export const HERO_COLORS = {
  sage: '#a0bfb9',        // Ana sage rengi
  coolGray: '#c0cfd0',    // Cool gray
  lightGray: '#f5f5f5',   // Light gray
  white: '#ffffff',       // White
  warmGreen: '#80b48c'    // Warm green (accent/check)
} as const;

// Animation timeline sabitleri
export const ANIMATION_TIMELINE = {
  dollyAndOrbit: { start: 0.00, end: 0.20 },    // Dolly-in + mikro orbit
  sweepTransition: { start: 0.20, end: 0.55 },  // Tarama geçişi
  paperAlignment: { start: 0.55, end: 0.80 },   // Kağıt hizalama
  circleAndCheck: { start: 0.80, end: 0.92 },   // Çember + check
  stabilize: { start: 0.92, end: 1.00 }         // Sabitlenme
} as const;

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

  // Internal state
  private scrollTrigger?: ScrollTrigger;
  private animationFrame?: number;
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private papers: Paper[] = [];
  private currentProgress = 0;
  private devicePixelRatio = 1;

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

  ngAfterViewInit(): void {
    this.setupScene();
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
        originalX: canvasWidth * 0.4 + Math.random() * canvasWidth * 0.3,
        originalY: canvasHeight * 0.3 + Math.random() * canvasHeight * 0.4,
        originalRotation: (Math.random() - 0.5) * 30, // -15 to +15 degrees
        finalX: canvasWidth * 0.65 + i * 2, // Stack position
        finalY: canvasHeight * 0.4 + i * 1,
        finalRotation: i * 0.5 // Slight offset in stack
      };

      // Initial position
      paper.x = paper.originalX;
      paper.y = paper.originalY;
      paper.rotation = paper.originalRotation;

      this.papers.push(paper);
    }
  }

  private createScrollTrigger(): void {
    this.scrollTrigger = this.scrollService.createScrollScene({
      trigger: this.heroContainer.nativeElement,
      start: 'top top',
      end: `+=${this.scrollLengthPx}`,
      pin: this.pin,
      scrub: true,
      onUpdate: (progress: number) => {
        this.onScrollProgress(progress);
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

    // Timeline hesaplamaları
    const timeline = ANIMATION_TIMELINE;

    // 0.00-0.20: Dolly-in + micro orbit (sadece hafif transform)
    let cameraScale = 1;
    let cameraRotation = 0;
    if (progress <= timeline.dollyAndOrbit.end) {
      const dollyProgress = progress / timeline.dollyAndOrbit.end;
      cameraScale = 0.9 + dollyProgress * 0.1; // 0.9 -> 1.0
      cameraRotation = Math.sin(dollyProgress * Math.PI * 2) * 2; // ±2 degrees micro orbit
    }

    // Canvas transform uygula
    this.ctx.save();
    this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
    this.ctx.scale(cameraScale, cameraScale);
    this.ctx.rotate(cameraRotation * Math.PI / 180);
    this.ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // 0.20-0.55: Sweep transition
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
        const easedProgress = this.scrollService.easing.easeOutQuart(alignProgress);
        
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

      // Grafit çizgiler (okunmaz)
      this.drawGraphiteLines(paper);

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

    this.ctx.restore();
  }

  private drawGraphiteLines(paper: Paper): void {
    if (!this.ctx) return;

    this.ctx.save();
    
    // Grafit rengi (sage/gray karışımı)
    this.ctx.strokeStyle = this.colors.coolGray;
    this.ctx.globalAlpha = 0.7;
    this.ctx.lineWidth = 1;

    // Rastgele çizgiler
    const lineCount = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < lineCount; i++) {
      const startX = -paper.width / 2 + 10 + Math.random() * (paper.width - 40);
      const startY = -paper.height / 2 + 10 + i * 25;
      const endX = startX + 30 + Math.random() * 50;
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, startY);
      this.ctx.stroke();
    }

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
    
    const centerX = canvasWidth * 0.65;
    const centerY = canvasHeight * 0.3;
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
