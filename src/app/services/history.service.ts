import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HistoryItem {
  id: string;
  timestamp: string;
  shapeKey: string;
  shapeLabel: string;
  inputs: { label: string; value: number }[];
  results: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private STORAGE_KEY = 'geometric_calculator_history';
  private historySubject = new BehaviorSubject<HistoryItem[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  getHistory(): Observable<HistoryItem[]> {
    return this.historySubject.asObservable();
  }

  addHistory(
    shapeKey: string,
    shapeLabel: string,
    inputs: { label: string; value: number }[],
    results: string[]
  ): void {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      shapeKey,
      shapeLabel,
      inputs,
      results
    };

    const currentHistory = this.historySubject.value;
    const updatedHistory = [newItem, ...currentHistory].slice(0, 50); // Limit to last 50 calculations
    this.historySubject.next(updatedHistory);
    this.saveToStorage(updatedHistory);
  }

  deleteItem(id: string): void {
    const updatedHistory = this.historySubject.value.filter(item => item.id !== id);
    this.historySubject.next(updatedHistory);
    this.saveToStorage(updatedHistory);
  }

  clearHistory(): void {
    this.historySubject.next([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.historySubject.next(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Error loading history from localStorage', e);
      }
    }
  }

  private saveToStorage(history: HistoryItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.error('Error saving history to localStorage', e);
      }
    }
  }
}
