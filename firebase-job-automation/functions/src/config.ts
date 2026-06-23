// config.ts - Configuration with API keys
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Rise API
  riseApi: {
    baseUrl: 'https://api.joinrise.io/api/v1',
    endpoints: {
      jobs: '/jobs/public',
      openJobs: '/jobs/openjobs',
      trending: '/jobs/public?isTrending=true'
    },
    defaultParams: {
      limit: 20,
      sort: 'desc',
      sortedBy: 'createdAt',
      includeDescription: true
    }
  },

  // Social Media API Keys
  social: {
    facebook: {
      pageId: process.env.FACEBOOK_PAGE_ID || '',
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
      apiVersion: 'v18.0'
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY || '',
      apiSecret: process.env.TWITTER_API_SECRET || '',
      accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
      accessSecret: process.env.TWITTER_ACCESS_SECRET || ''
    },
    instagram: {
      accountId: process.env.INSTAGRAM_ACCOUNT_ID || '',
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || ''
    },
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      channelId: process.env.TELEGRAM_CHANNEL_ID || ''
    },
    tiktok: {
      accessToken: process.env.TIKTOK_ACCESS_TOKEN || '',
      openId: process.env.TIKTOK_OPEN_ID || ''
    }
  },

  // Posting Schedule
  schedule: {
    postsPerDay: 6,
    intervalMinutes: 120, // 2 hours between posts
    timezone: 'Africa/Nairobi'
  },

  // Content Settings
  content: {
    maxTitleLength: 100,
    maxDescriptionLength: 280, // Twitter limit
    maxTextLength: 1000,
    includeHashtags: true,
    hashtags: ['jobs', 'hiring', 'career', 'remotework', 'jobsearch']
  },

  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || ''
  }
};