import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cccg.homie',
  appName: 'homie',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'cccg-mobile-c246b.firebaseapp.com'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '199501567932-p9ik1sr4fk3la7kpiluptne4117b2m27.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
