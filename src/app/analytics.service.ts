// src/app/services/analytics.service.ts
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from '@angular/fire/firestore';
import { ProfileService } from './profile.service';
import { firstValueFrom } from 'rxjs';

interface AudioCompletion {
  userId: string;
  userEmail: string;
  declarationId: string;
  declarationTitle: string;
  completedAt: Date;
  duration: number; // in minutes
}

interface AnalyticsSummary {
  totalTimeSpent: string;
  currentStreak: number;
  longestStreak: number;
  sessionsWatched: number;
  weeklyStats: { date: string; minutes: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private currentUser: any = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private profileService: ProfileService
  ) {
    // Subscribe to user profile changes
    this.profileService.userProfile$.subscribe(profile => {
      this.currentUser = profile;
    });
  }

  async logCompletion(declarationId: string, declarationTitle: string, duration: number): Promise<void> {
    if (!this.currentUser) {
      console.error('No user profile found');
      return;
    }
  
    const completion: AudioCompletion = {
      userId: this.currentUser.uid,
      userEmail: this.currentUser.email,
      declarationId,
      declarationTitle,
      completedAt: new Date(),
      duration: duration // duration in seconds
    };
  
    const completionsRef = collection(this.firestore, 'audioCompletions');
    await addDoc(completionsRef, completion);
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }
  
    try {
      const completionsRef = collection(this.firestore, 'audioCompletions');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
  
      // Simplified query while index is building
      const userCompletionsQuery = query(
        completionsRef,
        where('userId', '==', this.currentUser.uid),
        orderBy('completedAt', 'desc')
      );
  
      const querySnapshot = await getDocs(userCompletionsQuery);
      const completions = querySnapshot.docs.map(doc => ({
        ...doc.data() as AudioCompletion,
        completedAt: (doc.data()['completedAt'] as Timestamp).toDate()
      })).filter(completion => completion.completedAt >= weekAgo);
  
      const weeklyStats = this.calculateWeeklyStats(completions);
      const currentStreak = await this.calculateCurrentStreak(this.currentUser.uid);
      const longestStreak = await this.calculateLongestStreak(this.currentUser.uid);
      const totalMinutes = completions.reduce((acc, curr) => acc + (curr.duration / 60), 0);
      const totalTimeSpent = this.formatTotalTime(totalMinutes);
  
      return {
        totalTimeSpent,
        currentStreak,
        longestStreak,
        sessionsWatched: completions.length,
        weeklyStats
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalTimeSpent: '0h 0m',
        currentStreak: 0,
        longestStreak: 0,
        sessionsWatched: 0,
        weeklyStats: [
          { date: 'Mon', minutes: 0 },
          { date: 'Tue', minutes: 0 },
          { date: 'Wed', minutes: 0 },
          { date: 'Thu', minutes: 0 },
          { date: 'Fri', minutes: 0 },
          { date: 'Sat', minutes: 0 },
          { date: 'Sun', minutes: 0 }
        ]
      };
    }
  }

  private async calculateCurrentStreak(userId: string): Promise<number> {
    const completionsRef = collection(this.firestore, 'audioCompletions');
    const query24HoursAgo = new Date(new Date().setHours(0, 0, 0, 0));

    const recentCompletionsQuery = query(
      completionsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );

    const querySnapshot = await getDocs(recentCompletionsQuery);
    const completions = querySnapshot.docs.map(doc => 
      (doc.data()['completedAt'] as Timestamp).toDate()
    );

    if (completions.length === 0) return 0;

    // Check if user has completed anything today or yesterday
    const mostRecent = completions[0];
    const timeDiff = query24HoursAgo.getTime() - mostRecent.getTime();
    if (timeDiff > 48 * 60 * 60 * 1000) return 0;

    let streak = 1;
    let currentDate = new Date(mostRecent);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < completions.length; i++) {
      const prevDate = new Date(completions[i]);
      prevDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  }

  private async calculateLongestStreak(userId: string): Promise<number> {
    const completionsRef = collection(this.firestore, 'audioCompletions');
    const allCompletionsQuery = query(
      completionsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );

    const querySnapshot = await getDocs(allCompletionsQuery);
    const dates = querySnapshot.docs.map(doc => 
      (doc.data()['completedAt'] as Timestamp).toDate()
    );

    if (dates.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;
    let currentDate = new Date(dates[0]);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i]);
      prevDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
      currentDate = prevDate;
    }

    return longestStreak;
  }

  private calculateWeeklyStats(completions: AudioCompletion[]): { date: string; minutes: number }[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const stats = days.map(day => ({ date: day, minutes: 0 }));
    
    completions.forEach(completion => {
      const dayIndex = completion.completedAt.getDay();
      const dayName = days[dayIndex];
      const dayStats = stats.find(stat => stat.date === dayName);
      if (dayStats) {
        dayStats.minutes += completion.duration;
      }
    });

    return stats;
  }

  private formatTotalTime(totalSeconds: number): string {
    totalSeconds *= 60;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    let timeString = '';
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    if (seconds > 0) timeString += `${seconds}s`;
  
    return timeString.trim() || '0s';
  }
}