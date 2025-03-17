// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { profileSetupGuard } from './profile-setup.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'gender',
    loadComponent: () => import('./gender/gender.page').then( m => m.GenderPage)
  },
  {
    path: 'profile-setup',
    canActivate: [profileSetupGuard],
    children: [
      {
        path: 'gender',
        loadComponent: () => import('./gender/gender.page').then(m => m.GenderPage)
      },
      {
        path: 'age',
        loadComponent: () => import('./age/age.page').then(m => m.AgePage)
      },
      {
        path: 'meditation-time',
        loadComponent: () => import('./meditation-time/meditation-time.page').then(m => m.MeditationTimePage)
      },
      {
        path: 'meditation-goals',
        loadComponent: () => import('./meditation-goals/meditation-goals.page').then(m => m.MeditationGoalsPage)
      },
      {
        path: 'personal-info',
        loadComponent: () => import('./personal-info/personal-info.page').then(m => m.PersonalInfoPage)
      },
      {
        path: 'accountedit',
        loadComponent: () => import('./account-edit/account-edit.page').then(m => m.AccountEditPage)
      }
    ]
  },
  {
    path: 'account-edit',
    loadComponent: () => import('./account-edit/account-edit.page').then( m => m.AccountEditPage)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.page').then( m => m.AnalyticsPage)
  },
  {
    path: 'series/:id',
    loadComponent: () => import('./series-detail/series-detail.page').then(m => m.SeriesDetailPage)
  },
  {
    path: 'series-detail',
    loadComponent: () => import('./series-detail/series-detail.page').then( m => m.SeriesDetailPage)
  },
  {
    path: 'help-center',
    loadComponent: () => import('./help-center/help-center.page').then( m => m.HelpCenterPage)
  }
];