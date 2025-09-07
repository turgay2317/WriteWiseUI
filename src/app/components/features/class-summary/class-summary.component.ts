import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassApiService } from '../../../services/api/class-api.service';
import { AppStateService } from '../../../services/core/app-state.service';

@Component({
  selector: 'app-class-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-summary.component.html'
})
export class ClassSummaryComponent {
  constructor(
    public classSummaryService: ClassApiService,
    public appState: AppStateService
  ) {}
}
