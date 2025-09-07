import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { StudentPortalService } from '../../services/api/student-portal.service';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header 
      [panelTitle]="'Öğrenci Paneli'" 
      [subtitle]="'Write Wise Eğitim Platformu'" 
      [userName]="svc.studentName()" 
      [userInitials]="svc.studentName().slice(0,1)"
      [userRole]="'Öğrenci'"
      (logoutClick)="onLogout()"
    ></app-header>

    <main class="layout-container mx-auto max-w-6xl px-4 lg:px-8 py-4">
      <div class="mb-3">
        <h1 class="text-xl lg:text-2xl font-bold text-espresso text-center">Hoş geldin, {{ svc.studentName() }}</h1>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <!-- Left: Exams (always visible) -->
        <section class="card p-3 h-full flex flex-col">
          <div class="text-base font-semibold text-espresso mb-2">Sınavlar</div>
          <div class="h-[420px] overflow-y-auto divide-y divide-borderGray/60 border border-borderGray rounded-lg">
            <button *ngFor="let exam of svc.myExams()" class="w-full text-left h-14 px-3 hover:bg-primary/10" (click)="svc.selectExam(exam)" [ngClass]="{'bg-infoSurface/30': svc.selectedExam()?.id===exam.id}">
              <div class="flex items-center justify-between h-full">
                <div class="text-[16px] font-semibold text-espresso">{{ exam.subject }}</div>
                <div class="text-sm text-espresso/70">{{ exam.date }}</div>
              </div>
              <div class="text-xs text-espresso/60">Ortalama: {{ exam.score }} / 100</div>
            </button>
          </div>
          <div class="mt-2 text-sm text-espresso/80" *ngIf="svc.selectedExam()">Seçili sınav ortalama: <span class="font-semibold">{{ svc.selectedExam()?.score }} / 100</span></div>
        </section>

        <!-- Right: AI Feedback -->
        <section class="card p-2 h-full flex flex-col">
          <div class="text-base font-semibold text-espresso mb-2">Yapay Zeka Geri Bildirimi</div>
          <div class="h-[430px] overflow-y-auto rounded-lg">
            <div *ngIf="!svc.selectedExam()" class="h-full pt-0 px-2 pb-2">
              <div class="h-full border border-dashed border-borderGray rounded-lg grid place-items-center text-espresso/50">Listeden bir sınav seçin</div>
            </div>
            <div *ngIf="svc.selectedExam()" class="h-full p-3">
              <div class="h-full border border-borderGray rounded-lg">
                <div class="space-y-3 p-3">
                  <div *ngFor="let q of svc.selectedExamQuestions(); index as i" class="card p-3">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="text-sm font-semibold text-espresso mb-1">{{ i+1 }}. Soru</div>
                        <div class="text-sm text-espresso/80">{{ q.text }}</div>
                      </div>
                      <div class="text-sm font-semibold text-espresso">{{ q.llmScore }} / {{ q.maxScore }}</div>
                    </div>
                    <div class="mt-2 text-xs text-espresso/70">
                      {{ q.rationale }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class StudentPageComponent {
  constructor(public svc: StudentPortalService) {}

  onLogout() {
    // Basit demo: login sayfasına yönlendir
    window.location.href = '/login?role=student';
  }
}


