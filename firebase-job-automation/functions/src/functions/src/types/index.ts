// types/index.ts
export interface Job {
    _id: string;
    title: string;
    description: string;
    locationAddress: string;
    type: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    owner: {
      companyName: string;
      photo?: string;
      sector?: string;
      rating?: string;
      locationAddress?: string;
      teamSize?: number;
    };
  }
  
  export interface PostContent {
    title: string;
    text: string;
    description: string;
    company: string;
    location: string;
    jobType: string;
    url: string;
    imageUrl?: string;
    hashtags: string[];
    seoKeywords: string[];
  }
  
  export interface SocialPostResult {
    platform: string;
    success: boolean;
    postId?: string;
    error?: string;
    url?: string;
  }
  
  export interface PostHistory {
    id: string;
    jobId: string;
    title: string;
    platform: string;
    postedAt: string;
    postUrl?: string;
    engagement?: {
      likes?: number;
      shares?: number;
      comments?: number;
    };
  }