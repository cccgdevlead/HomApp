import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon,
  IonAvatar, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  pencil, personOutline, 
  notificationsOutline, lockClosedOutline,
  helpCircleOutline, informationCircleOutline,
  logOutOutline, searchOutline
} from 'ionicons/icons';
import { ProfileService } from '../profile.service';
import { AuthService } from '../auth.service';

@Component({
  template: `
    <ion-content>
      <div class="content-container">
        <ng-container *ngIf="profile$ | async as profile">
          <!-- Header -->
          <div class="header">
            <div class="user-info">
              <ion-avatar>
                <img [src]="profile?.photoURL || 'assets/profilecircle.png'" alt="profile">
              </ion-avatar>
              <h1>Account</h1>
            </div>
            <div class="header-actions">
              <ion-icon name="search-outline"></ion-icon>
              <ion-icon name="notifications-outline"></ion-icon>
            </div>
          </div>

          <!-- Profile Section -->
          <div class="profile-section">
            <ion-avatar class="large-avatar">
              <img [src]="profile.photoURL || 'assets/profilecircle.png'" alt="Profile photo">
            </ion-avatar>
            <h2 class="profile-name">{{ profile.fullName }}</h2>
            <p class="profile-email">{{ profile.email }}</p>
            <ion-button fill="clear" (click)="editProfile()">
              <ion-icon name="pencil" slot="icon-only"></ion-icon>
            </ion-button>
          </div>

          <!-- Menu Items -->
          <div class="menu-list">
            <div class="menu-item" (click)="editProfile()">
              <div class="menu-icon">
                <ion-icon name="person-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>Personal Info</h3>
              </div>
            </div>

            <div class="menu-item">
              <div class="menu-icon">
                <ion-icon name="notifications-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>Notification</h3>
              </div>
            </div>

            <div class="menu-item">
              <div class="menu-icon">
                <ion-icon name="lock-closed-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>Security</h3>
              </div>
            </div>

            <div class="menu-item" (click)="goToHelpCenter()">
              <div class="menu-icon">
                <ion-icon name="help-circle-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>Help Center</h3>
              </div>
            </div>

            <div class="menu-item">
              <div class="menu-icon">
                <ion-icon name="information-circle-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>About Hour Of Meditation</h3>
              </div>
            </div>

            <div class="menu-item logout" (click)="logout()">
              <div class="menu-icon">
                <ion-icon name="log-out-outline"></ion-icon>
              </div>
              <div class="menu-content">
                <h3>Logout</h3>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </ion-content>
  `,
  styles: [`
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

    .profile-section {
      text-align: center;
      position: relative;
      margin-bottom: 32px;
      padding: 24px;
      background: #F8FAFC;
      border-radius: 16px;

      .large-avatar {
        width: 80px;
        height: 80px;
        margin: 0 auto 16px;
      }

      .profile-name {
        margin: 0;
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 18px;
        font-weight: 500;
        color: #111827;
      }

      .profile-email {
        margin: 4px 0 0;
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 14px;
        color: #6B7280;
      }

      ion-button {
        position: absolute;
        top: 16px;
        right: 16px;
        --color: #111827;
      }
    }

    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #F8FAFC;
      border-radius: 16px;
      cursor: pointer;

      .menu-icon {
        width: 40px;
        height: 40px;
        background: #FFFFFF;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        ion-icon {
          font-size: 20px;
          color: #111827;
        }
      }

      .menu-content {
        h3 {
          margin: 0;
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }
      }

      &.logout {
        margin-top: 16px;

        .menu-icon ion-icon {
          color: #EF4444;
        }

        .menu-content h3 {
          color: #EF4444;
        }
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonAvatar,
    IonButton
  ]
})
export class AccountMainPage {
  profile$ = this.profileService.userProfile$;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      pencil, personOutline, 
      notificationsOutline, lockClosedOutline,
      helpCircleOutline, informationCircleOutline,
      logOutOutline, searchOutline
    });
  }

  editProfile() {
    this.router.navigate(['/account-edit']);
  }

  goToHelpCenter() {
    this.router.navigate(['/help-center']);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}