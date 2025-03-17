// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { map, take, switchMap } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    switchMap(async (user) => {
      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // Check profile completion
      const isProfileComplete = await profileService.checkProfileComplete();
      if (!isProfileComplete) {
        console.log('Guard: Profile incomplete, redirecting to setup');
        return router.createUrlTree(['/profile-setup/gender']);
      }

      return true;
    })
  );
};