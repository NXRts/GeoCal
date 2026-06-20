import { Component } from '@angular/core';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { HistoryComponent } from './components/history/history.component';
import { InstructionsComponent } from './components/instructions/instructions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent, HistoryComponent, InstructionsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Kalkulator Geometri';
}
