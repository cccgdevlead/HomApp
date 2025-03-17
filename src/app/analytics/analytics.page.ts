// src/app/pages/analytics/analytics.page.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../analytics.service';
import { IonHeader, IonContent, IonTitle, IonToolbar, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline } from 'ionicons/icons';
import Chart from 'chart.js/auto';

@Component({
  template: `
        <ion-content>
      <div class="content-container">
        <!-- Header -->
        <div class="header">
          <div class="user-info">
            <ion-buttons>
              <ion-back-button defaultHref="/tabs/tab1"></ion-back-button>
            </ion-buttons>
            <h1>Analytics</h1>
          </div>
          <button class="period-selector">
            This week
            <ion-icon name="chevron-down-outline"></ion-icon>
          </button>
        </div>

        <div class="analytics-container">
          <!-- Total Time Card -->
          <div class="stats-card main-stat">
            <div class="stat-content">
              <h2>{{ analytics?.totalTimeSpent }}</h2>
              <p>of total time spent this week</p>
            </div>
            
            <!-- Weekly Chart -->
            <div class="chart-container">
              <canvas #chartCanvas></canvas>
            </div>
          </div>

          <!-- Streak Stats -->
          <div class="stats-grid">
            <div class="stats-card">
              <h3>{{ analytics?.currentStreak }}d</h3>
              <p>current streak</p>
            </div>
            <div class="stats-card">
              <h3>{{ analytics?.longestStreak }}d</h3>
              <p>longest streak</p>
            </div>
          </div>

          <!-- Sessions -->
          <div class="stats-card">
            <h3>{{ analytics?.sessionsWatched }}</h3>
            <p>sessions watched</p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .content-container {
      padding: 16px 16px 24px;
      background: #FFFFFF;
      min-height: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 0 4px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }
    }

    .title-container {
      display: flex;
      align-items: center;
      gap: 12px;

      h1 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 32px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }
    }

    .period-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 100px;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-size: 14px;
      color: #111827;
    }

    .analytics-container {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stats-card {
      background: #F8FAFC;
      border-radius: 20px;
      padding: 24px;

      h2 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 48px;
        font-weight: 400;
        color: #111827;
        margin: 0 0 8px;
      }

      h3 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 32px;
        font-weight: 400;
        color: #111827;
        margin: 0 0 8px;
      }

      p {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        color: #6B7280;
        margin: 0;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .chart-container {
    height: 200px;
    margin-top: 24px;
    position: relative;
    width: 100%;  // Add this
    background: transparent; // Add this
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonContent,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonBackButton,
    IonButtons
  ]
})

export class AnalyticsPage implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  analytics: any = null;
  chart: any;

  constructor(private analyticsService: AnalyticsService) {
    addIcons({ chevronDownOutline });
  }


  async ngOnInit() {
    try {
      this.analytics = await this.analyticsService.getAnalyticsSummary();
      console.log('Analytics loaded:', this.analytics); // Debug log
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set default data if analytics fails to load
      this.analytics = {
        totalTimeSpent: '0h 0m',
        currentStreak: 0,
        longestStreak: 0,
        sessionsWatched: 0,
        weeklyStats: Array(7).fill({ minutes: 0 }).map((_, i) => ({
          date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          minutes: 0
        }))
      };
    }
  }

  ngAfterViewInit() {
    const checkAndCreateChart = () => {
      if (this.chartCanvas && this.analytics) {
        this.createChart();
      } else {
        setTimeout(checkAndCreateChart, 100);
      }
    };

    checkAndCreateChart();
  }

  private createChart() {
    if (!this.analytics?.weeklyStats || !this.chartCanvas) {
      console.log('Missing required data:', { 
        hasAnalytics: !!this.analytics,
        hasWeeklyStats: !!this.analytics?.weeklyStats,
        hasCanvas: !!this.chartCanvas
      });
      return;
    }

    // Rest of your createChart code remains the same
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    if (this.chart) {
      this.chart.destroy();
    }
  
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Minutes',
          data: this.analytics.weeklyStats.map((stat: any) => stat.minutes),
          fill: true,
          borderColor: '#8C9AB7',
          backgroundColor: 'rgba(140, 154, 183, 0.15)',
          tension: 0.4,
          pointBackgroundColor: '#8C9AB7',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#FFFFFF',
            titleColor: '#111827',
            bodyColor: '#111827',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            titleFont: {
              family: "'Neue Haas Display', system-ui, sans-serif",
              size: 14,
              //weight: '500'
            },
            bodyFont: {
              family: "'Neue Haas Display', system-ui, sans-serif",
              size: 12
            },
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}m`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              //drawBorder: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: "'Neue Haas Display', system-ui, sans-serif",
                size: 12
              },
              color: '#6B7280',
              padding: 8,
              stepSize: 15  // Add this to match the design
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: "'Neue Haas Display', system-ui, sans-serif",
                size: 12
              },
              color: '#6B7280',
              padding: 8
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2
          }
        }
      }
    });
  }
}