// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, enableIndexedDbPersistence, initializeFirestore } from '@angular/fire/firestore';
import { AnalyticsService } from './analytics.service';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    AnalyticsService,
    provideHttpClient(),
    provideIonicAngular({}),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      // Initialize Firestore with settings
      const firestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        cacheSizeBytes: 1048576 * 100
      });
      
      // Enable offline persistence (optional)
      enableIndexedDbPersistence(firestore).catch((err) => {
        console.error('Error enabling offline persistence:', err);
      });
      
      return app;
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideRouter(routes)
  ]
};
