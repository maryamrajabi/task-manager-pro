import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface HealthResponse {
  status: string;
  application: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly title = signal('Task Manager Pro');
  protected readonly apiStatus = signal('Checking API...');

  constructor() {
    this.http.get<HealthResponse>('/api/health').subscribe({
      next: response => {
        this.apiStatus.set(
          `${response.status} — ${response.application}`
        );
      },
      error: () => {
        this.apiStatus.set('API unavailable');
      }
    });
  }
}
