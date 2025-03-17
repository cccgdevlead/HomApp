import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { 
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private profileService: ProfileService = inject(ProfileService)
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private platform: Platform) {
    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });

      // Add this initialization
    if (this.platform.is('capacitor')) {
      GoogleAuth.init();
    }
  }

 // src/app/services/auth.service.ts
async handlePostAuth(user: User) {
  try {
    const profile = await this.profileService.loadUserProfile(user.uid);
    console.log('loaded profile', profile);
    console.log('User profile', user.email);

    // Check if profile exists AND is complete with all required fields
    const isProfileComplete = await this.profileService.checkProfileComplete();
    
    if (!isProfileComplete) {
      console.log('Profile incomplete, redirecting to setup');
      // Force navigation and prevent other navigations
      await this.router.navigate(['/profile-setup/gender'], { replaceUrl: true });
      return;
    }

    console.log('Profile complete, redirecting to main app');
    await this.router.navigate(['/tabs/tab1']);
  } catch (error) {
    console.error('Error handling post-auth:', error);
    // Default to profile setup if there's an error
    await this.router.navigate(['/profile-setup/gender'], { replaceUrl: true });
    throw error;
  }
}

    // Update email login
    async emailLogin(email: string, password: string): Promise<any> {
      try {
        const result = await signInWithEmailAndPassword(this.auth, email, password);
        await this.handlePostAuth(result.user);
        return result;
      } catch (error) {
        console.error('Email login error:', error);
        throw error;
      }
    }
  
    // Update Google login
    async googleLogin() {
      try {
        if (this.platform.is('android') || this.platform.is('ios')) {
          console.log('Using native Google Sign-In');
          const user = await GoogleAuth.signIn();
          console.log('Native Google Sign-In result:', user);
          
          if (!user.authentication?.idToken) {
            throw new Error('No ID token received from Google Auth');
          }
    
          const credential = GoogleAuthProvider.credential(
            user.authentication.idToken
          );
          
          const result = await signInWithCredential(this.auth, credential);
          await this.handlePostAuth(result.user);
          return result;
        } else {
          console.log('Using web Google Sign-In');
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(this.auth, provider);
          await this.handlePostAuth(result.user);
          return result;
        }
      } catch (error) {
        console.error('Google Sign-In error:', error);
        throw error;
      }
    }
  
    // Update email signup
    async emailSignup(email: string, password: string): Promise<any> {
      try {
        const result = await createUserWithEmailAndPassword(this.auth, email, password);
        await this.handlePostAuth(result.user);
        return result;
      } catch (error) {
        console.error('Email signup error:', error);
        throw error;
      }
    }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Update user profile
  async updateUserProfile(displayName: string | null, photoURL: string | null = null): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    try {
      await updateProfile(user, { displayName, photoURL });
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}