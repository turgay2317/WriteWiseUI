import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassSummaryService } from '../../core/services/class-summary.service';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-class-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-summary.component.html'
})
export class ClassSummaryComponent {
  constructor(
    public classSummaryService: ClassSummaryService,
    public appState: AppStateService
  ) {}
}
