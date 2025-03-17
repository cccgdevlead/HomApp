// src/app/pages/profile-setup/personal-info.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonList, IonItem, IonLabel,
  IonInput, IonButtons, IonBackButton,
  IonAvatar, IonIcon, IonSpinner
} from '@ionic/angular/standalone';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProfileService } from '../profile.service';
import { addIcons } from 'ionicons';
import { camera, chevronForward } from 'ionicons/icons';

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
      <div class="scroll-container">  <!-- Add this wrapper -->
      <div class="content-container">
        <div class="header-section">
          <h1 class="title">Complete Your Profile</h1>
          <p class="subtitle">Don't worry, only you can see your personal data. No one else will be able to see it.</p>
        </div>

        <div class="form-section">
          <!-- Avatar Section
          <div class="avatar-container">
            <div class="avatar">
              <img [src]="photoURL || 'assets/default-avatar.png'" alt="Profile photo">
              <button class="edit-button" (click)="updateProfilePhoto()">
                <ion-icon name="pencil-square"></ion-icon>
              </button>
            </div>
          </div>
           -->

          <!-- Form Fields -->
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-container">
              <input
                [(ngModel)]="profile.fullName"
                type="text"
                class="form-input"
                placeholder="Enter your full name"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-container">
              <input
                [(ngModel)]="profile.phoneNumber"
                type="tel"
                class="form-input"
                placeholder="+1 (555) 000-0000"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Date of Birth</label>
            <div class="input-container">
              <input
                [(ngModel)]="profile.dateOfBirth"
                type="text"
                class="form-input"
                placeholder="DD/MM/YYYY"
              >
              <ion-icon name="calendar" class="input-icon"></ion-icon>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Country</label>
            <div class="input-container">
              <input
                [(ngModel)]="profile.country"
                type="text"
                class="form-input"
                placeholder="Select your country"
              >
              <ion-icon name="chevron-down" class="input-icon"></ion-icon>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div class="button-container">
        <ion-button
          expand="block"
          (click)="completeProfile()"
          [disabled]="!isFormValid() || isSubmitting"
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
      --padding-bottom: 100px;
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
      width: 216px;
      height: 12px;
      background: #141C29;
      border-radius: 100px;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      padding: 16px 24px;
      gap: 28px;
      margin-bottom: 120px; 
    }

    .header-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .avatar-container {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }

    .scroll-container {
      min-height: 100%;
      padding-bottom: 100px;
    }

    .avatar {
      width: 100px;
      height: 100px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .edit-button {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 25px;
        height: 25px;
        background: #141C29;
        border: none;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        ion-icon {
          color: #FFFFFF;
          font-size: 14px;
        }
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-label {
      font-family: 'Neue Haas Grotesk Text', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 400;
      font-size: 16px;
      line-height: 140%;
      letter-spacing: 0.2px;
      color: #212121;
    }

    .input-container {
      position: relative;
      width: 100%;
    }

    .form-input {
      width: 100%;
      height: 33px;
      border: none;
      border-bottom: 1px solid #141C29;
      background: transparent;
      font-family: 'Neue Haas Grotesk Display Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 500;
      font-size: 20px;
      line-height: 120%;
      color: #212121;
      padding: 0;
      padding-right: 32px;

      &::placeholder {
        color: #212121;
        opacity: 1;
      }

      &:focus {
        outline: none;
      }
    }

    .input-icon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      color: #141C29;
    }

    .button-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px 24px 36px;
      background: #FFFFFF;
      border-top: 1px solid #F5F5F5;
      z-index: 100; // Add z-index to ensure button stays on top
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
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButtons,
    IonBackButton,
    IonAvatar,
    IonIcon,
    IonSpinner
  ]
})
export class PersonalInfoPage {
  profile = {
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: ''
  };
  photoURL: string | null = null;
  isUploading = false;
  isSubmitting = false;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private storage: Storage
  ) {
    addIcons({ camera, chevronForward });
  }

  isFormValid(): boolean {
    return !!(
      this.profile.fullName &&
      this.profile.phoneNumber &&
      this.profile.dateOfBirth &&
      this.profile.country
    );
  }

  async updateProfilePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        width: 500, // Reasonable size for profile photo
        height: 500,
        correctOrientation: true
      });

      if (image.base64String) {
        this.isUploading = true;
        await this.uploadPhoto(image.base64String);
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      // Handle error appropriately
    } finally {
      this.isUploading = false;
    }
  }

  private async uploadPhoto(base64String: string) {
    try {
      const userId = await this.profileService.getCurrentUserId();
      if (!userId) throw new Error('No user ID found');

      const filePath = `profile-photos/${userId}_${new Date().getTime()}.jpg`;
      const storageRef = ref(this.storage, filePath);
      
      // Convert base64 to blob
      const blob = await fetch(`data:image/jpeg;base64,${base64String}`).then(res => res.blob());
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, blob);
      
      // Get download URL
      this.photoURL = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  async completeProfile() {
    if (!this.isFormValid()) return;

    try {
      this.isSubmitting = true;
      
      await this.profileService.saveUserProfile({
        ...this.profile,
        photoURL: this.photoURL,
        isProfileComplete: true
      });

      // Navigate to main app
      this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      console.error('Error saving profile:', error);
      // Handle error appropriately
    } finally {
      this.isSubmitting = false;
    }
  }
}