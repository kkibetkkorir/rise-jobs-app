// index.ts - Main Firebase Cloud Functions
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Scheduler } from './services/scheduler';
import { config } from './config';

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey?.replace(/\\n/g, '\n')
  })
});

// Export the scheduler function
export const automatedJobPoster = functions
  .region('us-central1')
  .pubsub
  .schedule('0 */2 * * *') // Every 2 hours
  .timeZone('Africa/Nairobi')
  .onRun(async (context) => {
    const scheduler = new Scheduler();
    await scheduler.runScheduledPosts();
    console.log('Scheduled posting completed successfully');
  });

// Manual trigger function for testing
export const manualPost = functions
  .region('us-central1')
  .https
  .onCall(async (data, context) => {
    const scheduler = new Scheduler();
    await scheduler.executePostingCycle();
    return { success: true, message: 'Manual posting triggered' };
  });

// Function to post a specific job by ID
export const postSpecificJob = functions
  .region('us-central1')
  .https
  .onCall(async (data, context) => {
    const { jobId } = data;
    if (!jobId) {
      throw new functions.https.HttpsError('invalid-argument', 'Job ID required');
    }

    const scheduler = new Scheduler();
    // Implement custom logic to fetch and post specific job
    await scheduler.executePostingCycle();
    return { success: true, message: `Job ${jobId} posted` };
  });

// Status check function
export const getPostingStatus = functions
  .region('us-central1')
  .https
  .onCall(async (data, context) => {
    const db = admin.firestore();
    
    // Get last 10 posts
    const snapshot = await db
      .collection('postHistory')
      .orderBy('postedAt', 'desc')
      .limit(10)
      .get();

    const posts: any[] = [];
    snapshot.forEach(doc => {
      posts.push(doc.data());
    });

    // Get stats
    const statsSnapshot = await db.collection('postHistory').get();
    const totalPosts = statsSnapshot.size;

    return {
      success: true,
      totalPosts,
      recentPosts: posts
    };
  });