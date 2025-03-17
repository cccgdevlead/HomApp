import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {
  IonHeader, IonToolbar, IonContent, IonInput, IonButton, 
  IonBackButton, IonButtons, IonCheckbox, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOff, eye } from 'ionicons/icons';

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
      <div class="signup-container">
        <div class="header-section">
          <h1 class="title">Create an Account</h1>
          <p class="subtitle">Enter your account email & password.</p>
        </div>

        <form #signupForm="ngForm" (ngSubmit)="onSignup()" class="form-section">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-container">
              <ion-input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="custom-input"
                [class.has-value]="email.length > 0"
              ></ion-input>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-container">
              <ion-input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                required
                minlength="6"
                class="custom-input"
                [class.has-value]="password.length > 0"
              ></ion-input>
              <button class="visibility-toggle" (click)="togglePasswordVisibility('password')" type="button">
                <ion-icon [name]="showPassword ? 'eye' : 'eye-off'"></ion-icon>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-container">
              <ion-input
                [type]="showConfirmPassword ? 'text' : 'password'"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
                class="custom-input"
                [class.has-value]="confirmPassword.length > 0"
              ></ion-input>
              <button class="visibility-toggle" (click)="togglePasswordVisibility('confirm')" type="button">
                <ion-icon [name]="showConfirmPassword ? 'eye' : 'eye-off'"></ion-icon>
              </button>
            </div>
          </div>

          <div class="remember-me">
            <ion-checkbox [(ngModel)]="rememberMe" name="rememberMe"></ion-checkbox>
            <span>Remember me</span>
          </div>
        </form>
      </div>

      <div class="button-container">
        <ion-button
          expand="block"
          type="submit"
          class="signup-button"
          [disabled]="isLoading || !signupForm?.valid || password !== confirmPassword"
          (click)="onSignup()"
        >
          <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
          <span *ngIf="!isLoading">Sign Up</span>
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
      --border-width: 0;
      --padding-start: 0;
      --padding-end: 0;
      padding: 8px 0;
    }
  
    ion-back-button {
      --color: #111827;
      --icon-font-size: 24px;
      --padding-start: 16px;
    }
  
    .progress-bar {
      width: 160px;
      height: 4px;
      background: #F1F5F9;
      border-radius: 100px;
      margin: 0 auto;
    }
  
    .progress-fill {
      width: 33.33%;
      height: 100%;
      background: #111827;
      border-radius: 100px;
    }
  
    .signup-container {
      display: flex;
      flex-direction: column;
      padding: 8px 16px;
    }
  
    .header-section {
      margin-bottom: 40px;
    }
  
    .title {
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-weight: 400;
      font-size: 40px;
      line-height: 1.1;
      color: #111827;
      margin: 0 0 16px 0;
    }
  
    .subtitle {
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-weight: 400;
      font-size: 18px;
      line-height: 1.5;
      color: #111827;
      margin: 0;
    }
  
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
  
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  
    .form-label {
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 400;
      color: #111827;
    }
  
    .input-container {
      position: relative;
      border-bottom: 1px solid rgba(17, 24, 39, 0.1);
    }
  
    .custom-input {
      --padding-start: 0;
      --padding-end: 40px;
      --background: transparent;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-weight: 400;
      font-size: 18px;
      --color: #111827;
      margin: 0;
      height: 44px;
    }
  
    .visibility-toggle {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111827;
      opacity: 0.5;
  
      ion-icon {
        font-size: 20px;
      }
    }
  
    .remember-me {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 32px;
  
      ion-checkbox {
        width: 24px;
        height: 24px;
        --background-checked: #111827;
        --checkbox-background-checked: #111827;
        --border-color: rgba(17, 24, 39, 0.1);
        --checkbox-border-color: rgba(17, 24, 39, 0.1);
        --checkbox-border-radius: 6px;
        --border-width: 1px;
        margin: 0;
      }
  
      span {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
      }
    }
  
    .button-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background: #FFFFFF;
      border-top: 1px solid rgba(17, 24, 39, 0.05);
    }
  
    .signup-button {
      --background: #7E8DA4;
      --color: #FFFFFF;
      --border-radius: 100px;
      --box-shadow: none;
      height: 52px;
      margin: 0;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-weight: 500;
      font-size: 16px;
      text-transform: none;
    }
  
    /* Style for filled inputs */
    .custom-input.has-value {
      --color: #111827;
    }
  
    /* Hide ion-input placeholder when it has value */
    .custom-input.has-value::placeholder {
      color: transparent;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonContent,
    IonInput,
    IonSpinner,
    IonButton,
    IonBackButton,
    IonButtons,
    IonCheckbox
  ]
})
export class SignupPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ eyeOff, eye });
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async onSignup() {
    if (this.isLoading || !this.isValidForm()) return;

    this.isLoading = true;
    try {
      await this.authService.emailSignup(this.email, this.password);
      await this.router.navigate(['/tabs']);
    } catch (error: any) {
      console.error('Signup error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private isValidForm(): boolean {
    return this.password === this.confirmPassword && 
           this.password.length >= 6 &&
           this.email.includes('@');
  }
}