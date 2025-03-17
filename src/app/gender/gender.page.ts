import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonContent,
  IonButton, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../models/user-profile.model';

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
          <h1 class="title">What is your gender?</h1>
          <p class="subtitle">Select from the options below.</p>
        </div>

        <div class="options-container">
          <div class="radio-group">
            <label class="radio-option" [class.selected]="selectedGender === 'male'">
              <div class="radio-button">
                <div class="radio-inner" *ngIf="selectedGender === 'male'"></div>
              </div>
              <span class="radio-label">I am male</span>
              <input
                type="radio"
                name="gender"
                [value]="'male'"
                [(ngModel)]="selectedGender"
                hidden
              >
            </label>

            <div class="divider"></div>

            <label class="radio-option" [class.selected]="selectedGender === 'female'">
              <div class="radio-button">
                <div class="radio-inner" *ngIf="selectedGender === 'female'"></div>
              </div>
              <span class="radio-label">I am female</span>
              <input
                type="radio"
                name="gender"
                [value]="'female'"
                [(ngModel)]="selectedGender"
                hidden
              >
            </label>

            <div class="divider"></div>

            <label class="radio-option" [class.selected]="selectedGender === 'not_specified'">
              <div class="radio-button">
                <div class="radio-inner" *ngIf="selectedGender === 'not_specified'"></div>
              </div>
              <span class="radio-label">Rather not say</span>
              <input
                type="radio"
                name="gender"
                [value]="'not_specified'"
                [(ngModel)]="selectedGender"
                hidden
              >
            </label>
          </div>
        </div>
      </div>

      <div class="button-container">
        <ion-button 
          expand="block" 
          (click)="continue()"
          [disabled]="!selectedGender"
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
      width: 72px;
      height: 12px;
      background: #2C3F5D;
      border-radius: 100px;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      padding: 16px 24px 48px;
      gap: 28px;
      height: calc(100% - 118px);
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

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .radio-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px 0;
      gap: 16px;
      cursor: pointer;
    }

    .radio-button {
      width: 24px;
      height: 24px;
      border: 2px solid #2C3F5D;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio-inner {
      width: 12px;
      height: 12px;
      background: #2C3F5D;
      border-radius: 50%;
    }

    .radio-label {
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 500;
      font-size: 18px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #212121;
      flex-grow: 1;
    }

    .divider {
      height: 1px;
      background: #EEEEEE;
      margin: 0;
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
export class GenderPage {
  selectedGender: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  async continue() {
    if (!this.selectedGender) return;

    try {
      await this.profileService.saveUserProfile({
        gender: this.selectedGender as UserProfile['gender']
      });
      this.router.navigate(['/profile-setup/age']);
    } catch (error) {
      console.error('Error saving gender:', error);
    }
  }
}