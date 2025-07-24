import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <h2>API Demo Page</h2>
    <button (click)="fetchGreeting()">Fetch Greeting from API</button>
    <div *ngIf="greeting">Response: {{ greeting }}</div>
  `,
})
export class ApiDemoPage {
  greeting: string | null = null;

  constructor(private http: HttpClient) {}

  fetchGreeting() {
    this.http.get<{ message: string }>('http://localhost:3000/').subscribe({
      next: (res) => (this.greeting = res.message),
      error: (err) =>
        (this.greeting = 'Error: ' + (err?.message || 'Unknown error')),
    });
  }
}
