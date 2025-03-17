export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  gender: 'male' | 'female' | 'not_specified';
  ageRange: string;
  meditationTime: string;
  createdAt: string; 
  meditationGoals: string[];
  photoURL?: string | null;
  isProfileComplete: boolean;
}