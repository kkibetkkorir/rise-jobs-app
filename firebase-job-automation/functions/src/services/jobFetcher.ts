// services/jobFetcher.ts
import axios from 'axios';
import { config } from '../config';
import { Job } from '../types';

export class JobFetcher {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.riseApi.baseUrl;
  }

  async fetchJobs(page: number = 1, limit: number = 20): Promise<Job[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${config.riseApi.endpoints.jobs}`, {
        params: {
          page,
          limit,
          sort: config.riseApi.defaultParams.sort,
          sortedBy: config.riseApi.defaultParams.sortedBy,
          includeDescription: config.riseApi.defaultParams.includeDescription,
          isTrending: true
        }
      });

      const jobs = response.data?.result?.jobs || [];
      return this.processJobs(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  async fetchTrendingJobs(): Promise<Job[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${config.riseApi.endpoints.trending}`, {
        params: {
          limit: 20
        }
      });

      const jobs = response.data?.result?.jobs || [];
      return this.processJobs(jobs);
    } catch (error) {
      console.error('Error fetching trending jobs:', error);
      return [];
    }
  }

  private processJobs(jobs: any[]): Job[] {
    return jobs.map(job => ({
      _id: job._id,
      title: job.title || 'Position Available',
      description: job.description || job.job?.[0]?.description || '',
      locationAddress: job.locationAddress || job.location?.address || 'Remote',
      type: job.type || job.jobType || 'Hybrid',
      url: job.url || job.job?.[0]?.url || '#',
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      owner: {
        companyName: job.owner?.companyName || 'Company',
        photo: job.owner?.photo || job.photo,
        sector: job.owner?.sector,
        rating: job.owner?.rating,
        locationAddress: job.owner?.locationAddress,
        teamSize: job.owner?.teamSize
      }
    }));
  }

  async getJobsForPosting(): Promise<Job[]> {
    // Get a mix of trending and new jobs
    const trending = await this.fetchTrendingJobs();
    const newJobs = await this.fetchJobs(1, 10);
    
    // Combine and deduplicate
    const combined = [...trending, ...newJobs];
    const unique = Array.from(
      new Map(combined.map(job => [job._id, job])).values()
    );

    // Shuffle to get variety
    return this.shuffleArray(unique);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}