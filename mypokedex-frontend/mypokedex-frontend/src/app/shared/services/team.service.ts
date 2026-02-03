import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly storageKey = 'mypokedex-team';
  private readonly maxSize = 6;

  getTeam(): number[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  addToTeam(id: number): void {
    const team = this.getTeam();
    if (team.includes(id) || team.length >= this.maxSize) return;
    team.push(id);
    this.saveTeam(team);
  }

  removeFromTeam(id: number): void {
    const team = this.getTeam().filter(item => item !== id);
    this.saveTeam(team);
  }

  clearTeam(): void {
    this.saveTeam([]);
  }

  private saveTeam(team: number[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(team));
    } catch {
      // ignore
    }
  }
}
