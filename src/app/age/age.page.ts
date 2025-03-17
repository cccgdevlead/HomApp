import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonContent,
  IonButton, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { ProfileService } from '../profile.service';

@Component({
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button icon="chevron-back" text=""></ion-back-button>
        </ion-buttons>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="content-container">
        <div class="header-section">
          <h1 class="title">Choose Your Age</h1>
          <p class="subtitle">Select from the options below.</p>
        </div>

        <div class="age-grid">
          <div class="age-row" *ngFor="let chunk of ageRangesChunked">
            <button 
              *ngFor="let range of chunk"
              class="age-chip"
              [class.selected]="selectedAge === range"
              (click)="selectAge(range)"
            >
              {{ range }}
            </button>
          </div>
        </div>
      </div>

      <div class="button-container">
        <ion-button
          expand="block"
          (click)="continue()"
          [disabled]="!selectedAge"
          class="continue-button"
        >
          Continue
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --page-padding: 24px;
    }

    ion-content {
      --background: #FFFFFF;
    }

    ion-header ion-toolbar {
      --background: transparent;
      --border-color: transparent;
      padding: 12px 0;
    }

    ion-back-button {
      --color: #212121;
      --icon-font-size: 24px;
      --padding-start: 24px;
      margin: 0;
    }

    .progress-bar {
      width: 216px;
      height: 12px;
      background: #EEEEEE;
      border-radius: 100px;
      margin: 0 auto;
    }

    .progress-fill {
      width: 96px;
      height: 12px;
      background: #141C29;
      border-radius: 100px;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      padding: 16px 24px 48px;
      gap: 28px;
    }

    .header-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }

    .title {
      font-family: 'Neue Haas Grotesk Display Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 450;
      font-size: 32px;
      line-height: 120%;
      color: #212121;
      margin: 0;
    }

    .subtitle {
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 18px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #212121;
      margin: 0;
    }

    .age-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .age-row {
      display: flex;
      gap: 16px;
      width: 100%;
    }

    .age-chip {
      flex: 1;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 24px;
      background: transparent;
      border: 2px solid #2C3F5D;
      border-radius: 100px;
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #2C3F5D;
      cursor: pointer;
      transition: all 0.2s ease;

      &.selected {
        background: #2C3F5D;
        color: #F0F2F8;
      }

      &:hover {
        opacity: 0.9;
      }
    }

    .button-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px 24px 36px;
      background: #FFFFFF;
      border-top: 1px solid #F5F5F5;
    }

    .continue-button {
      --background: #8C9AB7;
      --color: #FFFFFF;
      --border-radius: 100px;
      --box-shadow: 4px 8px 24px rgba(24, 34, 58, 0.25);
      height: 58px;
      margin: 0;
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.2px;
      text-transform: none;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton
  ]
})
export class AgePage {
  ageRanges = ['14-17', '18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '≥50'];
  selectedAge: string = '';

  get ageRangesChunked() {
    const result = [];
    for (let i = 0; i < this.ageRanges.length; i += 2) {
      result.push(this.ageRanges.slice(i, i + 2));
    }
    return result;
  }

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  selectAge(range: string) {
    this.selectedAge = range;
  }

  async continue() {
    if (!this.selectedAge) return;

    try {
      await this.profileService.saveUserProfile({
        ageRange: this.selectedAge
      });
      this.router.navigate(['/profile-setup/meditation-time']);
    } catch (error) {
      console.error('Error saving age:', error);
    }
  }
}