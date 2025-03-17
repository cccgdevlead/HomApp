// src/app/services/profile.service.ts
import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
  where
} from '@angular/fire/firestore';
import { UserProfile } from './models/user-profile.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'userProfiles';
  
  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loadUserProfile(user.uid);
      } else {
        this.userProfileSubject.next(null);
      }
    });

    // Check if collection exists on service initialization
    this.ensureCollectionExists();
  }

  private async ensureCollectionExists(): Promise<void> {
    try {
      console.log(`Checking if ${this.COLLECTION_NAME} collection exists...`);
      const collectionRef = collection(this.firestore, this.COLLECTION_NAME);
      
      // Try to get one document to check if collection exists
      const q = query(collectionRef, limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`Collection ${this.COLLECTION_NAME} is empty or doesn't exist yet. It will be created when the first document is added.`);
      } else {
        console.log(`Collection ${this.COLLECTION_NAME} exists and contains documents.`);
      }
    } catch (error) {
      console.error(`Error checking collection existence:`, error);
    }
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  async loadUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      console.log('Loading profile for UID:', uid);
      const docRef = doc(this.firestore, 'userProfiles', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Profile found:', docSnap.data());
        const profile = docSnap.data() as UserProfile;
        this.userProfileSubject.next(profile);
        return profile;
      } else {
        console.log('No profile found, creating initial profile');
        // Create an initial profile if none exists
        const initialProfile: Partial<UserProfile> = {
          uid,
          email: this.auth.currentUser?.email || '',
          isProfileComplete: false,
          createdAt: new Date().toISOString()
        };
        await this.saveUserProfile(initialProfile);
        return initialProfile as UserProfile;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error instanceof Error && error.message.includes('offline')) {
        console.log('Device is offline, trying to load from cache');
        // You could implement cache handling here
      }
      return null;
    }
  }

  async saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new Error('No authenticated user found');
      }
      
      const uid = this.auth.currentUser.uid;
      console.log('Saving profile for UID:', uid, 'Profile data:', profile);

      // Create profile data
      const profileData = {
        ...profile,
        uid,
        email: this.auth.currentUser.email,
        updatedAt: new Date().toISOString(),
        ...(profile.createdAt ? {} : { createdAt: new Date().toISOString() })
      };

      // Get reference to the document
      const docRef = doc(this.firestore, 'userProfiles', uid);

      // Use setDoc with merge option to update or create
      await setDoc(docRef, profileData, { merge: true });
      console.log('Profile saved successfully');

      // Reload the profile
      await this.loadUserProfile(uid);
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof Error && error.message.includes('offline')) {
        console.log('Device is offline, changes will be synced when online');
        // You could implement offline handling here
      }
      throw error;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new Error('No authenticated user found');
      }
      
      const uid = this.auth.currentUser.uid;
      console.log('Updating profile for UID:', uid, 'Updates:', updates);

      const docRef = doc(this.firestore, 'userProfiles', uid);
      
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
      console.log('Profile updated successfully');
      
      await this.loadUserProfile(uid);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async checkProfileComplete(): Promise<boolean> {
    try {
      const uid = this.getCurrentUserId();
      if (!uid) return false;
      
      const profile = await this.loadUserProfile(uid);
      
      // Check for all required fields
      const isComplete = !!(
        profile &&
        profile.gender &&
        profile.ageRange &&
        profile.meditationTime &&
        profile.meditationGoals &&
        profile.meditationGoals.length > 0 &&
        profile.fullName &&
        profile.dateOfBirth
      );
  
      // Update profile completion status if it's different
      if (profile && profile.isProfileComplete !== isComplete) {
        await this.updateUserProfile({ isProfileComplete: isComplete });
      }
  
      return isComplete;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }

  async deleteUserAccount(): Promise<void> {
    try {
      if (!this.auth.currentUser) throw new Error('No authenticated user');
      
      const uid = this.auth.currentUser.uid;
      
      // Delete user profile document
      const docRef = doc(this.firestore, 'userProfiles', uid);
      await deleteDoc(docRef);
      
      // Delete Firebase Auth user
      await this.auth.currentUser.delete();
      
      // Clear local data
      this.userProfileSubject.next(null);
      localStorage.clear();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}