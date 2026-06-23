// services/scheduler.ts
import * as admin from 'firebase-admin';
import { config } from '../config';
import { JobFetcher } from './jobFetcher';
import { ContentGenerator } from './contentGenerator';
import { SocialPoster } from './socialPoster';
import { PostContent, PostHistory } from '../types';

export class Scheduler {
  private jobFetcher: JobFetcher;
  private contentGenerator: ContentGenerator;
  private socialPoster: SocialPoster;
  private db: admin.firestore.Firestore;

  constructor() {
    this.jobFetcher = new JobFetcher();
    this.contentGenerator = new ContentGenerator();
    this.socialPoster = new SocialPoster();
    this.db = admin.firestore();
  }

  async executePostingCycle(): Promise<void> {
    console.log('Starting posting cycle...');

    try {
      // Get jobs
      const jobs = await this.jobFetcher.getJobsForPosting();
      
      if (jobs.length === 0) {
        console.log('No jobs available for posting');
        return;
      }

      // Get last posted job IDs
      const lastPostIds = await this.getLastPostedJobIds();
      
      // Filter out recently posted jobs
      const availableJobs = jobs.filter(job => !lastPostIds.includes(job._id));
      
      if (availableJobs.length === 0) {
        console.log('No new jobs to post');
        return;
      }

      // Select a random job
      const selectedJob = availableJobs[Math.floor(Math.random() * availableJobs.length)];
      
      // Generate content
      const content = this.contentGenerator.generatePostContent(selectedJob);
      
      // Post to all platforms
      console.log(`Posting: ${selectedJob.title} at ${selectedJob.owner.companyName}`);
      const results = await this.socialPoster.postToAllPlatforms(content);
      
      // Log results
      await this.logPostingResults(selectedJob, content, results);
      
      console.log('Posting cycle completed:', results);
    } catch (error) {
      console.error('Error in posting cycle:', error);
    }
  }

  private async getLastPostedJobIds(): Promise<string[]> {
    try {
      const snapshot = await this.db
        .collection('postHistory')
        .orderBy('postedAt', 'desc')
        .limit(10)
        .get();

      const ids: string[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as PostHistory;
        if (data.jobId) {
          ids.push(data.jobId);
        }
      });

      return ids;
    } catch (error) {
      console.error('Error getting last posted jobs:', error);
      return [];
    }
  }

  private async logPostingResults(
    job: any,
    content: PostContent,
    results: any[]
  ): Promise<void> {
    try {
      const batch = this.db.batch();

      // Log each successful post
      results.forEach(result => {
        if (result.success) {
          const docRef = this.db.collection('postHistory').doc();
          const history: PostHistory = {
            id: docRef.id,
            jobId: job._id,
            title: job.title,
            platform: result.platform,
            postedAt: new Date().toISOString(),
            postUrl: result.url
          };
          batch.set(docRef, history);
        }
      });

      // Log the job content for tracking
      const contentRef = this.db.collection('postedContent').doc();
      batch.set(contentRef, {
        jobId: job._id,
        content,
        postedAt: new Date().toISOString(),
        results
      });

      await batch.commit();
    } catch (error) {
      console.error('Error logging posting results:', error);
    }
  }

  async runScheduledPosts(): Promise<void> {
    const postsPerDay = config.schedule.postsPerDay;
    const intervalMs = config.schedule.intervalMinutes * 60 * 1000;

    // Initial post
    await this.executePostingCycle();

    // Schedule remaining posts for the day
    for (let i = 1; i < postsPerDay; i++) {
      setTimeout(async () => {
        await this.executePostingCycle();
      }, intervalMs * i);
    }
  }
}