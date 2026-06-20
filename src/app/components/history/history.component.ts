import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryItem } from '../../services/history.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  historyItems: HistoryItem[] = [];
  copiedId: string | null = null;
  private historySubscription?: Subscription;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historySubscription = this.historyService.getHistory().subscribe(items => {
      this.historyItems = items;
    });
  }

  ngOnDestroy(): void {
    this.historySubscription?.unsubscribe();
  }

  deleteItem(id: string): void {
    this.historyService.deleteItem(id);
  }

  clearAll(): void {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat perhitungan?')) {
      this.historyService.clearHistory();
    }
  }

  copyToClipboard(item: HistoryItem): void {
    const inputsStr = item.inputs.map(i => `${i.label}: ${i.value}`).join(', ');
    const resultsStr = item.results.join('\n');
    const textToCopy = `=== Kalkulasi ${item.shapeLabel} ===\nInput: ${inputsStr}\nHasil:\n${resultsStr}\n=========================`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.copiedId = item.id;
        setTimeout(() => {
          this.copiedId = null;
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
      });
    }
  }
}
