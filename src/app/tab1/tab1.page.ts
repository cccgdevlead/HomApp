import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  IonContent,
  IonAvatar,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, searchOutline, chevronForward, home, playCircle, analyticsOutline, personOutline } from 'ionicons/icons';
import { ProfileService } from '../profile.service';
import { SeriesService } from '../series.service';

@Component({
  selector: 'app-tab1',
  template: `
    <ion-content>
      <div class="content-container">
        <!-- Header -->
        <div class="header">
          <div class="user-info">
            <ion-avatar>
              <img [src]="(profile$ | async)?.photoURL || 'assets/profilecircle.png'" alt="profile">
            </ion-avatar>
            <h1>Hello, {{ (profile$ | async)?.fullName || 'User' }}</h1>
          </div>
          <!--
          <div class="header-actions">
            <ion-icon name="search-outline"></ion-icon>
            <ion-icon name="notifications-outline"></ion-icon>
          </div>
          -->
        </div>


        <!-- Welcome Card -->
        <div class="welcome-card">
          <div class="welcome-content">
            <h2>Welcome<br>HoM</h2>
            <p>Get connected with God and yourself on a deeper level.</p>
          </div>
          <div>
           <img src="assets/rec.png" alt="circle">
          </div>
        </div>

        <!-- Live Section -->
        <div class="live-section" (click)="goToLive()">
          <div>
            <h3>Watch HoM Live</h3>
            <p>Every Saturday at 9AM MST</p>
          </div>
        </div>

        <!-- Series Section -->
        <div class="series-header">
          <h3>Explore by Series</h3>
          <ion-icon name="chevron-forward"></ion-icon>
        </div>

        <!-- Series Cards -->
        <div class="series-cards">
          <div class="series-card" 
               *ngFor="let series of series$ | async" 
               (click)="goToSeries(series.name)">
            <div class="card-content">
              <h4>{{ series.name }}</h4>
              <p>{{ series.description }}</p>
            </div>
            <div>
              <img src="assets/rec.png" alt="circle">
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --navy-blue: #2B3F6C;
      --text-gray: #4B5563;
      --page-margin: 24px;
      --button-height: 52px;
    }

    ion-content {
      --background: #F6F9FF;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      padding: var(--page-margin);
      background: #F6F9FF;
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

      ion-avatar {
        width: 32px;
        height: 32px;
      }

      h1 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }
    }

    .header-actions {
      display: flex;
      gap: 20px;

      ion-icon {
        font-size: 20px;
        color: #111827;
      }
    }

    .welcome-card {
      background: var(--navy-blue);
      border-radius: 20px;
      padding: 28px 24px;
      position: relative;
      overflow: hidden;
      margin-bottom: 24px;
      height: 160px;
      display: flex;
      justify-content: space-between;

      .welcome-content {
        position: relative;
        z-index: 2;

        h2 {
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 24px;
          font-weight: 400;
          color: #FFFFFF;
          margin: 0 0 12px;
          line-height: 1.2;
        }

        p {
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 14px;
          color: #FFFFFF;
          margin: 0;
          opacity: 0.9;
          max-width: 200px;
          line-height: 1.5;
        }
      }

      img {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 120px;
        height: 120px;
        object-fit: cover;
      }
    }

    .live-section {
      background: #F8FAFC;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
      cursor: pointer;

      h3 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: #111827;
        margin: 0 0 4px;
      }

      p {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 14px;
        color: #6B7280;
        margin: 0;
        font-weight: 400;
      }
    }

    .series-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 20px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }

      ion-icon {
        font-size: 20px;
        color: #111827;
      }
    }

    .series-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .series-card {
      background: #F8FAFC;
      border-radius: 16px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;

      .card-content {
        position: relative;
        z-index: 2;
        max-width: 65%;

        h4 {
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #111827;
          margin: 0 0 8px;
        }

        p {
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 14px;
          color: #6B7280;
          margin: 0;
          line-height: 1.4;
          font-weight: 400;
        }
      }

      img {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 80px;
        height: 80px;
        object-fit: cover;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonAvatar,
    IonIcon
  ],
  providers: [SeriesService]  // Add this line
})
export class Tab1Page {
  profile$ = this.profileService.userProfile$;
  series$ = this.seriesService.getSeries();

  constructor(
    private profileService: ProfileService,
    private seriesService: SeriesService,
    private router: Router
  ) {
    addIcons({ 
      notificationsOutline, 
      searchOutline, 
      chevronForward,
      home,
      playCircle,
      analyticsOutline,
      personOutline
    });
  }

  goToLive() {
    // Navigation logic for live section
    window.open('https://www.youtube.com/@emmanuel.adewusi/streams', '_blank');
    console.log('Navigating to live section');
  }

  goToSeries(seriesName: string) {
    this.router.navigate(['/series', seriesName]);
  }
}