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
          <h1 class="title">What are your goals with Christian meditation?</h1>
          <p class="subtitle">Choose from the options below.</p>
        </div>

        <div class="goals-container">
          <label 
            *ngFor="let goal of goals" 
            class="goal-option"
            [class.selected]="goal.selected"
          >
            <div class="checkbox-wrapper">
              <div class="checkbox">
                <div class="checkmark" *ngIf="goal.selected"></div>
              </div>
              <span class="goal-text">{{ goal.label }}</span>
            </div>
            <input
              type="checkbox"
              [checked]="goal.selected"
              (change)="toggleGoal(goal)"
              hidden
            >
          </label>
        </div>
      </div>

      <div class="button-container">
        <ion-button
          expand="block"
          (click)="continue()"
          [disabled]="selectedGoals.length === 0"
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
      width: 144px;
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

    .goals-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .goal-option {
      background: #F0F2F8;
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      min-height: 65px;
      display: flex;
      align-items: center;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid #141C29;
      border-radius: 4px;
      background: #FFFFFF;
      position: relative;
    }

    .selected .checkbox {
      background: #141C29;
      border-color: #141C29;
    }

    .checkmark {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 8px;
      border-left: 2px solid #FFFFFF;
      border-bottom: 2px solid #FFFFFF;
      transform: translate(-50%, -60%) rotate(-45deg);
    }

    .goal-text {
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 500;
      font-size: 18px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #2C3F5D;
      flex: 1;
    }

    .selected .goal-text {
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
export class MeditationGoalsPage {
  goals = [
    { value: 'mental', label: 'Mental (Anxiety, Focus, etc.)', selected: false },
    { value: 'emotional', label: 'Emotional (Regulation, etc.)', selected: false },
    { value: 'physical', label: 'Physical (Athletics, Fitness, etc.)', selected: false },
    { value: 'spiritual', label: 'Spiritual (Intimacy With Jesus, Reading The Word, etc.)', selected: false },
    { value: 'general', label: 'General (Visualization, Quietness)', selected: false },
    { value: 'undecided', label: 'Not sure/nothing specific yet', selected: false }
  ];

  get selectedGoals(): string[] {
    return this.goals
      .filter(goal => goal.selected)
      .map(goal => goal.value);
  }

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  toggleGoal(goal: any) {
    goal.selected = !goal.selected;
  }

  async continue() {
    if (this.selectedGoals.length === 0) return;

    try {
      await this.profileService.saveUserProfile({
        meditationGoals: this.selectedGoals
      });
      this.router.navigate(['/profile-setup/personal-info']);
    } catch (error) {
      console.error('Error saving meditation goals:', error);
    }
  }
}