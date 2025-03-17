import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
  IonRange,
  IonAvatar,
  IonModal,
  IonButtons,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  playCircleOutline, 
  pauseCircleOutline, 
  closeOutline,
  searchOutline,
  notificationsOutline
} from 'ionicons/icons';
import { SeriesService, AudioFile } from '../series.service';
import { AnalyticsService } from '../analytics.service';

@Component({
  template: `
    <ion-content>
      <div class="content-container">
        <!-- Header -->
        <div class="header">
          <div class="user-info">
            <ion-avatar>
              <img [src]="'assets/profilecircle.png'" alt="profile">
            </ion-avatar>
            <h1>{{ seriesName }}</h1>
          </div>
          <div class="header-actions">
            <ion-icon name="search-outline"></ion-icon>
            <ion-icon name="notifications-outline"></ion-icon>
          </div>
        </div>

        <ion-list>
          <ion-item 
            *ngFor="let audio of audioFiles" 
            (click)="playAudio(audio)"
            lines="none"
            class="audio-item"
          >
            <div class="play-icon">
              <ion-icon name="play-circle-outline"></ion-icon>
            </div>
            <div class="audio-info">
              <h2>{{ getAudioTitle(audio.url) }}</h2>
              <p>{{ audio.duration || 'Loading...' }}</p>
            </div>
          </ion-item>
        </ion-list>

        <!-- Player Modal -->
        <ion-modal 
          [isOpen]="isPlayerVisible"
          [breakpoints]="[0, 1]"
          [initialBreakpoint]="1"
          (didDismiss)="closePlayer()"
        >
          <ng-template>
            <ion-content class="player-content">
              <ion-button fill="clear" class="close-button" (click)="closePlayer()">
                <ion-icon name="close-outline"></ion-icon>
              </ion-button>

              <div class="player-container">
                <h1>{{ currentAudioTitle }}</h1>
                
                <div class="player-circle">
                  <ion-button 
                    fill="clear" 
                    class="play-pause-button"
                    (click)="togglePlay()"
                  >
                    <ion-icon [name]="isPlaying ? 'pause-circle-outline' : 'play-circle-outline'"></ion-icon>
                  </ion-button>
                </div>

                <div class="progress-container">
                  <ion-range
                    [(ngModel)]="progress"
                    (ionKnobMoveStart)="onSliderDragStart()"
                    (ionKnobMoveEnd)="onSliderDragEnd($event)"
                    mode="ios"
                  >
                    <div slot="start">{{ formatTime(currentTime) }}</div>
                    <div slot="end">{{ formatTime(duration) }}</div>
                  </ion-range>
                </div>
              </div>
            </ion-content>
          </ng-template>
        </ion-modal>
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

    ion-list {
      background: transparent;
      padding: 0;
    }

    .audio-item {
      --background: #F8FAFC;
      border-radius: 16px;
      margin-bottom: 16px;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      --inner-padding-end: 16px;

      .play-icon {
        background: #FFFFFF;
        width: 48px;
        height: 48px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        ion-icon {
          font-size: 24px;
          color: #2C3E50;
        }
      }

      .audio-info {
        h2 {
          margin: 0;
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: #111827;
        }

        p {
          margin: 4px 0 0;
          font-family: 'Neue Haas Display', system-ui, sans-serif;
          font-size: 14px;
          color: #6B7280;
          font-weight: 400;
        }
      }
    }

    .player-content {
      --background: white;
    }

    .close-button {
      position: absolute;
      top: 20px;
      left: 20px;
      margin: 0;
      --padding-start: 0;
      --padding-end: 0;

      ion-icon {
        font-size: 24px;
        color: #2C3E50;
      }
    }

    .player-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 24px;

      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #2C3E50;
        text-align: center;
        margin: 0 0 40px;
      }

      .player-circle {
        width: 200px;
        height: 200px;
        background: #F0F2F5;
        border-radius: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;

        .play-pause-button {
          --padding-start: 0;
          --padding-end: 0;
          margin: 0;

          ion-icon {
            font-size: 64px;
            color: #2C3E50;
          }
        }
      }

      .progress-container {
        width: 100%;

        ion-range {
          --bar-background: #E0E0E0;
          --bar-background-active: #2C3E50;
          --knob-background: #2C3E50;
          --pin-background: #2C3E50;
        }
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
    IonIcon,
    IonButton,
    IonRange,
    IonModal,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonAvatar
  ],
  providers: [SeriesService]
})
export class SeriesDetailPage implements OnInit, OnDestroy {
  seriesName: string = '';
  audioFiles: AudioFile[] = [];
  isPlayerVisible = false;
  currentAudioUrl: string | null = null;
  currentAudioTitle: string = '';
  isPlaying = false;
  progress = 0;
  currentTime = 0;
  duration = 0;
  audio: HTMLAudioElement | null = null;
  private audioMetadataPromises: Map<string, Promise<void>> = new Map();

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private analyticsService: AnalyticsService
  ) {
    addIcons({ 
      playCircleOutline, 
      pauseCircleOutline, 
      closeOutline,
      searchOutline,
      notificationsOutline
    });
  }

  ngOnInit() {
    this.seriesName = this.route.snapshot.paramMap.get('id') || '';
    this.loadAudioFiles();
  }

  loadAudioFiles() {
    console.log('Loading audio files for series:', this.seriesName);
    this.seriesService.getSeriesAudioFiles(this.seriesName).subscribe(files => {
      console.log('Received audio files:', files);
      this.audioFiles = files;
      
      // Preload durations for all audio files
      this.preloadDurations();
    });
  }

  /**
   * Preload durations for all audio files by fetching metadata
   */
  preloadDurations() {
    this.audioFiles.forEach((file, index) => {
      // Create a unique promise for each audio file
      const metadataPromise = new Promise<void>((resolve, reject) => {
        const tempAudio = new Audio();
        
        // Setup event listeners before setting the source
        tempAudio.addEventListener('loadedmetadata', () => {
          // Get the duration in seconds from the MP3 file
          const durationInSeconds = tempAudio.duration;
          
          // Format it and update the audio file object
          this.audioFiles[index].duration = this.formatTime(durationInSeconds);
          resolve();
        });
        
        // Handle errors
        tempAudio.addEventListener('error', (error) => {
          console.error(`Error loading audio metadata for: ${file.url}`, error);
          this.audioFiles[index].duration = 'Unknown';
          reject(error);
        });
        
        // Set the source to the MP3 file to begin loading its metadata
        tempAudio.src = file.url;
        tempAudio.load(); // Explicitly start loading the audio metadata
      });
      
      // Store the promise for potential later use
      this.audioMetadataPromises.set(file.url, metadataPromise);
    });
  }

  getAudioTitle(url: string): string {
    const filename = url.split('/').pop() || '';
    return filename.replace('.mp3', '');
  }

  playAudio(audio: AudioFile) {
    this.currentAudioUrl = audio.url;
    this.currentAudioTitle = this.getAudioTitle(audio.url);
    this.isPlayerVisible = true;
    this.setupAudio(audio.url);
  }

  setupAudio(url: string) {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.audio = new Audio(url);
    this.audio.addEventListener('ended', async () => {
      this.isPlaying = false;
      this.progress = 0;
      if (this.currentAudioUrl) {
        await this.analyticsService.logCompletion(
          this.currentAudioUrl,
          this.currentAudioTitle,
          Math.round(this.audio!.duration)
        );
      }
    });

    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio!.duration;
    });
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.progress = 0;
    });

    // Auto-play when ready
    this.audio.addEventListener('canplay', () => {
      if (this.audio) {
        this.audio.play();
        this.isPlaying = true;
      }
    });
  }

  togglePlay() {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  updateProgress() {
    if (!this.audio) return;
    
    this.currentTime = this.audio.currentTime;
    this.progress = (this.audio.currentTime / this.audio.duration) * 100;
  }

  onSliderDragStart() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  onSliderDragEnd(event: any) {
    if (!this.audio) return;

    const newTime = (event.detail.value / 100) * this.audio.duration;
    this.audio.currentTime = newTime;
    
    if (this.isPlaying) {
      this.audio.play();
    }
  }

  closePlayer() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.isPlayerVisible = false;
    this.currentAudioUrl = null;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}