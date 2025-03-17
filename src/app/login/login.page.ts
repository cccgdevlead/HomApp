import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Platform } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
  IonLabel, IonInput, IonButton, IonList, IonSpinner, 
  IonIcon, IonBackButton, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { Auth, getRedirectResult } from '@angular/fire/auth';

@Component({
  template: `
    <ion-content class="ion-padding">
      <div class="login-container">
        <!-- Circle Image -->
        <div class="circle-container">
          <img src="assets/medcircle.png" alt="circle">
        </div>

        <!-- Title and Subtitle -->
        <div class="text-container">
          <h1 class="title">Hour Of<br>Meditation</h1>
          <p class="subtitle">Discover the profound impact of guided Christian meditation. Welcome HoM.</p>
        </div>

        <!-- Pagination Dots -->
        <div class="pagination-dots">
          <div class="dot active"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Login Form -->
        <form #loginForm="ngForm" (ngSubmit)="onEmailLogin()" class="login-form" *ngIf="showLoginForm">
          <ion-list class="custom-list">
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
              ></ion-input>
            </ion-item>
          </ion-list>

          <ion-button 
            expand="block" 
            type="submit" 
            class="login-button"
            [disabled]="isLoading || !loginForm.valid"
          >
            <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
            <span *ngIf="!isLoading">Login</span>
          </ion-button>
        </form>

        <div class="action-buttons" *ngIf="!showLoginForm">
          <!-- Google Button -->
          <ion-button 
            expand="block" 
            (click)="onGoogleLogin()" 
            class="google-button"
            [disabled]="isLoading"
          >
            <div class="google-content">
              <ion-spinner *ngIf="isLoading" name="crescent"></ion-spinner>
              <ng-container *ngIf="!isLoading">
                <img src="assets/google-logo.png" alt="Google" class="google-icon">
                <span>Continue with Google</span>
              </ng-container>
            </div>
          </ion-button>

          <!-- Get Started Button -->
          <ion-button 
            expand="block" 
            (click)="goToSignup()" 
            class="get-started-button"
            [disabled]="isLoading"
          >
            Get Started
          </ion-button>

          <!-- Account Toggle -->
          <div class="account-toggle" (click)="toggleLoginForm()">
            I Already Have an Account
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --page-margin: 24px;
      --button-height: 52px;
    }

    ion-content {
      --background: #F6F9FF;
    }

    .login-container {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      padding: var(--page-margin);
      background: #F6F9FF;
    }

    .circle-container {
      margin-top: 80px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
    }

    .meditation-circle {
      width: 240px;
      height: 240px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E8EFFF 0%, #FFFFFF 100%);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    }

    .text-container {
      text-align: center;
      margin-bottom: 32px;
    }

    .title {
      font-family: Neue Haas Display;
      color: #2B3F6C;
      font-size: 40px;
      font-weight: 400;
      line-height: 1.2;
      margin: 0 0 16px 0;
    }

    .subtitle {
      color: #2B3F6C;
      font-size: 18px;
      line-height: 1.5;
      margin: 0;
      padding: 0 24px;
      opacity: 0.7;
    }

    .error-message {
      color: #dc2626;
      text-align: center;
      margin: 16px 0;
      padding: 8px;
      border-radius: 8px;
      background-color: rgba(220, 38, 38, 0.1);
    }

    .pagination-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 32px;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2B3F6C;
        opacity: 0.2;

        &.active {
          width: 24px;
          border-radius: 4px;
          opacity: 1;
        }
      }
    }

    .action-buttons {
      margin-top: auto;
      padding-bottom: 20px;
    }

    .google-button {
      --background: #FFFFFF;
      --color: #000000;
      --border-radius: 26px;
      --box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      height: var(--button-height);
      margin-bottom: 16px;

      .google-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .google-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }

      span {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .get-started-button {
      --background: #7E8DA4;
      --color: #FFFFFF;
      --border-radius: 26px;
      --box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      height: var(--button-height);
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }

    .account-toggle {
      color: #2B3F6C;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      margin-top: 24px;
      cursor: pointer;
    }

    // Login Form Styles
    .login-form {
      margin-top: auto;
      padding-bottom: 20px;

      ion-list {
        background: transparent;
        padding: 0;
      }

      ion-item {
        --background: transparent;
        --border-color: rgba(43, 63, 108, 0.1);
        --border-width: 1px;
        --border-radius: 8px;
        --padding-start: 16px;
        --padding-end: 16px;
        --inner-padding-end: 16px;
        margin-bottom: 16px;

        &:last-of-type {
          margin-bottom: 24px;
        }
      }

      ion-label {
        --color: #2B3F6C;
        font-size: 16px;
      }

      ion-input {
        --padding-start: 0;
        --padding-end: 0;
        font-size: 16px;
        --color: #2B3F6C;
      }

      .login-button {
        --background: #2B3F6C;
        --color: #FFFFFF;
        --border-radius: 26px;
        --box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        height: var(--button-height);
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonSpinner,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  showLoginForm: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private router: Router,
    private auth: Auth
  ) {
    addIcons({ logoGoogle });
  }

  async ngOnInit() {
    this.checkRedirectResult();
  }

  private async checkRedirectResult() {
    if (this.platform.is('mobileweb') || this.platform.is('mobile')) {
      try {
        console.log('Checking redirect result...');
        const result = await getRedirectResult(this.auth);
        if (result) {
          console.log('Got redirect result:', result);
          this.isLoading = true;
          await this.authService.handlePostAuth(result.user);
        }
      } catch (error: any) {
        console.error('Redirect result error:', error);
        this.errorMessage = error.message || 'Failed to complete sign-in';
      } finally {
        this.isLoading = false;
      }
    }
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
    this.errorMessage = '';
  }

  async onEmailLogin() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.emailLogin(this.email, this.password);
      this.toggleLoginForm();
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Failed to login';
    } finally {
      this.isLoading = false;
    }
  }

  async onGoogleLogin() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    try {
      if (this.platform.is('mobile')) {
        console.log('Using mobile auth flow');
      }
      const result = await this.authService.googleLogin();
      console.log('Google login successful:', result);
    } catch (error: any) {
      console.error('Google login error:', error);
      // More specific error messages
      if (error.message.includes('cancelled')) {
        this.errorMessage = 'Sign in was cancelled';
      } else if (error.message.includes('network')) {
        this.errorMessage = 'Please check your internet connection';
      } else {
        this.errorMessage = error.message || 'Failed to login with Google';
      }
    } finally {
      this.isLoading = false;
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}