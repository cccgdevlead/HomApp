import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
          <h1 class="title">How Long Do You Want to Spend in Meditation?</h1>
          <p class="subtitle">Choose from the options below.</p>
        </div>

        <div class="time-options">
          <label 
            *ngFor="let option of timeOptions" 
            class="time-option"
            [class.selected]="selectedTime === option.value"
          >
            <div class="radio-wrapper">
              <div class="radio-button">
                <div class="radio-inner" *ngIf="selectedTime === option.value"></div>
              </div>
              <span class="option-text">{{ option.label }}</span>
            </div>
            <input
              type="radio"
              [value]="option.value"
              [(ngModel)]="selectedTime"
              name="time"
              hidden
            >
          </label>
        </div>
      </div>

      <div class="button-container">
        <ion-button
          expand="block"
          (click)="continue()"
          [disabled]="!selectedTime"
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
      width: 108px;
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

    .time-options {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .time-option {
      background: #F0F2F8;
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      min-height: 65px;
      display: flex;
      align-items: center;
    }

    .radio-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .radio-button {
      width: 24px;
      height: 24px;
      border: 2px solid #2C3F5D;
      border-radius: 50%;
      background: #FFFFFF;
      position: relative;
    }

    .selected .radio-button {
      border-color: #141C29;
    }

    .radio-inner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      background: #141C29;
      border-radius: 50%;
    }

    .option-text {
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 500;
      font-size: 18px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #2C3F5D;
      flex: 1;
    }

    .selected .option-text {
      color: #212121;
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
    FormsModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton
  ]
})
export class MeditationTimePage {
  timeOptions = [
    { value: '<15', label: 'Less than 15 minutes / day' },
    { value: '15-30', label: 'Between 15 - 30 minutes / day' },
    { value: '30-60', label: 'Between 30 - 60 minutes / day' },
    { value: '>60', label: 'More than 60 minutes / day' },
    { value: 'undecided', label: 'I haven\'t decided yet' }
  ];
  selectedTime: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  async continue() {
    if (!this.selectedTime) return;

    try {
      await this.profileService.saveUserProfile({
        meditationTime: this.selectedTime
      });
      this.router.navigate(['/profile-setup/meditation-goals']);
    } catch (error) {
      console.error('Error saving meditation time:', error);
    }
  }
}