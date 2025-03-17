// src/app/guards/profile-setup.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

export const profileSetupGuard = () => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  return async () => {
    const isComplete = await profileService.checkProfileComplete();
    if (isComplete) {
      return router.createUrlTree(['/tabs/tab1']);
    }
    return true;
  };
};