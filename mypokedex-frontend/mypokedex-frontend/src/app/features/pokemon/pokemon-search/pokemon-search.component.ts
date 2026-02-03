import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-field">
      <span class="search-icon">SEARCH</span>
      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="onSearchChange()"
        placeholder="Search by name or Pokedex"
      />
    </div>
    @if (showSuggestions) {
      <div class="suggestions">
        @for (item of filteredSuggestions; track item) {
          <button
            class="suggestion-item"
            type="button"
            (click)="selectSuggestion(item)"
          >
            {{ item }}
          </button>
        }
      </div>
    }
  `
})
export class PokemonSearchComponent {
  @Output() search = new EventEmitter<string>();
  @Input() suggestions: string[] = [];

  query = '';

  onSearchChange(): void {
    this.search.emit(this.query);
  }

  get showSuggestions(): boolean {
    return this.query.length > 0 && this.filteredSuggestions.length > 0;
  }

  get filteredSuggestions(): string[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return [];
    return this.suggestions
      .filter(item => item.toLowerCase().includes(q))
      .slice(0, 6);
  }

  selectSuggestion(item: string): void {
    this.query = item;
    this.onSearchChange();
  }
}
