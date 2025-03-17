import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonList, IonItem, IonLabel, IonInput,
  IonDatetimeButton, IonDatetime, IonModal, IonSelect,
  IonSelectOption, IonAvatar, IonIcon, IonChip,
  IonAlert, IonButtons, IonBackButton, IonButton
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../models/user-profile.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera, chevronForward, trash } from 'ionicons/icons';

@Component({
  selector: 'app-accountedit',
  template: `
    <ion-content>
      <div class="content-container">
        <!-- Header -->
        <div class="header">
          <div class="user-info">
            <ion-buttons>
              <ion-back-button defaultHref="/tabs/tab3"></ion-back-button>
            </ion-buttons>
            <h1>Account</h1>
          </div>
        </div>

        <ng-container *ngIf="profile$ | async as profile">
          <!-- Profile Image 
          <div class="profile-image-container">
            <ion-avatar class="profile-avatar" (click)="updateProfilePhoto()">
              <img [src]="profile.photoURL || 'assets/default-avatar.png'" alt="Profile photo">
              <div class="photo-overlay">
                <ion-icon name="camera"></ion-icon>
              </div>
            </ion-avatar>
          </div>
          -->
          
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Full Name</ion-label>
              <ion-input
                [(ngModel)]="profile.fullName"
                (ionBlur)="updateProfile('fullName', profile.fullName)"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Phone Number</ion-label>
              <ion-input
                [(ngModel)]="profile.phoneNumber"
                (ionBlur)="updateProfile('phoneNumber', profile.phoneNumber)"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Date of Birth</ion-label>
              <ion-datetime-button datetime="birthdate"></ion-datetime-button>
              <ion-modal [keepContentsMounted]="true">
                <ng-template>
                  <ion-datetime
                    id="birthdate"
                    [(ngModel)]="profile.dateOfBirth"
                    (ionChange)="updateProfile('dateOfBirth', profile.dateOfBirth)"
                    presentation="date"
                    preferWheel="true"
                    [showDefaultButtons]="true"
                    [showClearButton]="true"
                  >
                    <span slot="title">Select Date of Birth</span>
                  </ion-datetime>
                </ng-template>
              </ion-modal>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Gender</ion-label>
              <ion-select
                [(ngModel)]="profile.gender"
                (ionChange)="updateProfile('gender', profile.gender)"
              >
                <ion-select-option value="male">Male</ion-select-option>
                <ion-select-option value="female">Female</ion-select-option>
                <ion-select-option value="not_specified">Rather not say</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Age Range</ion-label>
              <ion-select
                [(ngModel)]="profile.ageRange"
                (ionChange)="updateProfile('ageRange', profile.ageRange)"
              >
                <ion-select-option value="14-17">14-17</ion-select-option>
                <ion-select-option value="18-24">18-24</ion-select-option>
                <ion-select-option value="25-29">25-29</ion-select-option>
                <ion-select-option value="30-34">30-34</ion-select-option>
                <ion-select-option value="35-39">35-39</ion-select-option>
                <ion-select-option value="40-44">40-44</ion-select-option>
                <ion-select-option value="45-49">45-49</ion-select-option>
                <ion-select-option value="≥50">50 or above</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Meditation Time</ion-label>
              <ion-select
                [(ngModel)]="profile.meditationTime"
                (ionChange)="updateProfile('meditationTime', profile.meditationTime)"
              >
                <ion-select-option value="<15">Less than 15 minutes / day</ion-select-option>
                <ion-select-option value="15-30">Between 15-30 minutes / day</ion-select-option>
                <ion-select-option value="30-60">Between 30-60 minutes / day</ion-select-option>
                <ion-select-option value=">60">More than 60 minutes / day</ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Meditation Goals</ion-label>
              <div class="goals-container">
                <ion-chip
                  *ngFor="let goal of availableGoals"
                  [color]="isGoalSelected(goal.value, profile.meditationGoals) ? 'primary' : 'medium'"
                  (click)="toggleGoal(goal.value, profile.meditationGoals)"
                >
                  {{ goal.label }}
                </ion-chip>
              </div>
            </ion-item>

            <ion-item lines="none">
              <ion-button 
                fill="clear" 
                color="danger" 
                expand="block"
                (click)="confirmDeleteAccount()"
                class="delete-account-button"
              >
                <ion-icon slot="start" name="trash"></ion-icon>
                Delete Account
              </ion-button>
            </ion-item>
          </ion-list>
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

      h1 {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #111827;
        margin: 0;
      }
    }

    
    ion-item {
      --background: #F8FAFC;
      border-radius: 16px;
      margin-bottom: 16px;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      --inner-padding-end: 16px;
      --highlight-color-focused: #2B3F6C;

      ion-label {
        color: #111827;
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      ion-input, ion-select, ion-datetime-button {
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 16px;
        --color: #111827;
      }

      ion-select {
        --placeholder-color: #111827;
        --placeholder-opacity: 1;
        padding: 0;
        
        &::part(text) {
          color: #111827;
        }
      }

      ion-datetime-button {
        --color: #111827 !important;
        --background: transparent;
        margin: 0;
        padding: 0;
      }
    }

    ion-datetime {
      --background: #FFFFFF;
      --ion-color-primary: #2B3F6C;
    }

    ion-select-option {
      color: #111827;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
    }


    ion-content {
      --background: #FFFFFF;
    }

    .profile-image-container {
      margin: 20px 0;
      display: flex;
      justify-content: center;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      position: relative;
      cursor: pointer;
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 50%;

      ion-icon {
        color: #FFFFFF;
        font-size: 24px;
      }
    }

    .profile-avatar:hover .photo-overlay {
      opacity: 1;
    }

    ion-list {
      background: transparent;
      padding: 0;
    }

    .goals-container {
      padding: 8px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      ion-chip {
        --background: #F3F4F6;
        --color: #111827;
        font-family: 'Neue Haas Display', system-ui, sans-serif;
        font-size: 14px;
        height: 32px;
        border-radius: 16px;

        &[color="primary"] {
          --background: #2B3F6C;
          --color: #FFFFFF;
        }
      }
    }

    .delete-account-button {
      --color: #DC2626;
      width: 100%;
      justify-content: center;
      font-family: 'Neue Haas Display', system-ui, sans-serif;
      font-size: 16px;
      margin-top: 24px;

      ion-icon {
        margin-right: 8px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetimeButton,
    IonDatetime,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonAvatar,
    IonIcon,
    IonChip,
    IonAlert,
    IonButtons,
    IonBackButton,
    IonButton
  ]
})
export class AccountEditPage implements OnInit {
  profile$ = this.profileService.userProfile$;
  availableGoals = [
    { value: 'mental', label: 'Mental (Anxiety, Focus)' },
    { value: 'emotional', label: 'Emotional (Regulation)' },
    { value: 'physical', label: 'Physical (Athletics, Fitness)' },
    { value: 'spiritual', label: 'Spiritual (Intimacy With Jesus)' },
    { value: 'general', label: 'General (Visualization)' },
    { value: 'undecided', label: 'Not sure yet' }
  ];

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ camera, chevronForward });
  }

  ngOnInit() {
    // Check if profile is complete
    this.checkProfileCompletion();
  }

  async checkProfileCompletion() {
    const isComplete = await this.profileService.checkProfileComplete();
    if (!isComplete) {
      this.router.navigate(['/profile-setup/gender']);
    }
  }

  async updateProfilePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image.base64String) {
        await this.uploadPhoto(image.base64String);
      }
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  }

  private async uploadPhoto(base64String: string) {
    // Implement photo upload logic here
    const photoURL = ''; // Get URL after upload
    await this.updateProfile('photoURL', photoURL);
  }

  isGoalSelected(goal: string, selectedGoals: string[] = []): boolean {
    return selectedGoals.includes(goal);
  }

  async toggleGoal(goal: string, currentGoals: string[] = []) {
    const goals = [...currentGoals];
    const index = goals.indexOf(goal);
    
    if (index === -1) {
      goals.push(goal);
    } else {
      goals.splice(index, 1);
    }

    await this.updateProfile('meditationGoals', goals);
  }

  async updateProfile(field: keyof UserProfile, value: any) {
    try {
      await this.profileService.updateUserProfile({ [field]: value });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  async completeProfile() {
    try {
      await this.profileService.updateUserProfile({ isProfileComplete: true });
      // Optionally navigate or show success message
    } catch (error) {
      console.error('Error completing profile:', error);
    }
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      cssClass: 'delete-account-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'delete-button',
          handler: () => this.deleteAccount()
        }
      ]
    });

    await alert.present();
  }

  async deleteAccount() {
    try {
      // Show loading indicator
      const loading = await this.alertController.create({
        message: 'Deleting account...',
        backdropDismiss: false
      });
      await loading.present();

      await this.profileService.deleteUserAccount();
      
      await loading.dismiss();

      // Show success message
      const successAlert = await this.alertController.create({
        header: 'Account Deleted',
        message: 'Your account has been successfully deleted.',
        buttons: ['OK']
      });
      await successAlert.present();

      // Navigate to login
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error deleting account:', error);
      
      // Show error message
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Failed to delete account. Please try again later.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}