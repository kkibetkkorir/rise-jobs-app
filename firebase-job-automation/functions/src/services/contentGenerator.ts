// services/contentGenerator.ts
import { Job, PostContent } from '../types';
import { config } from '../config';

export class ContentGenerator {
  private usedJobs: Set<string> = new Set();

  generatePostContent(job: Job): PostContent {
    const title = this.truncateText(job.title, config.content.maxTitleLength);
    const company = job.owner.companyName;
    const location = job.locationAddress;
    const jobType = job.type;
    const url = job.url;

    // Generate SEO-optimized description
    const description = this.generateDescription(job);

    // Generate hashtags
    const hashtags = this.generateHashtags(job);

    // Generate keywords for SEO
    const seoKeywords = this.generateSEOKeywords(job);

    // Get image URL (use company logo or fallback)
    const imageUrl = job.owner.photo || this.getFallbackImage(job);

    // Generate post text with word limit
    const text = this.generatePostText(job, hashtags);

    return {
      title,
      text,
      description,
      company,
      location,
      jobType,
      url,
      imageUrl,
      hashtags,
      seoKeywords
    };
  }

  private generateDescription(job: Job): string {
    const parts = [
      `${job.title} at ${job.owner.companyName}`,
      `Location: ${job.locationAddress}`,
      `Type: ${job.type}`,
      `Sector: ${job.owner.sector || 'Various'}`
    ];

    // Add key skills from description if available
    const skillMatch = job.description.match(/(?:skills|requirements|qualifications)[\s\S]*?(?:\.|$)/i);
    if (skillMatch) {
      const skills = skillMatch[0]
        .replace(/^(skills|requirements|qualifications)[:\s]*/i, '')
        .slice(0, 100);
      if (skills) {
        parts.push(`Skills: ${skills}`);
      }
    }

    return parts.join(' | ');
  }

  private generateHashtags(job: Job): string[] {
    const baseHashtags = config.content.hashtags;
    const jobSpecific = [];

    // Add job type hashtag
    const typeMap: Record<string, string> = {
      'Hybrid': 'hybridwork',
      'Remote': 'remotework',
      'Onsite': 'onsitejob'
    };
    if (typeMap[job.type]) {
      jobSpecific.push(typeMap[job.type]);
    }

    // Add company sector hashtag
    if (job.owner.sector) {
      const sectorTag = job.owner.sector
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      if (sectorTag.length > 3) {
        jobSpecific.push(sectorTag);
      }
    }

    // Add location hashtag
    if (job.locationAddress) {
      const locationParts = job.locationAddress.split(',');
      const mainLocation = locationParts[0]?.trim().toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      if (mainLocation && mainLocation.length > 2) {
        jobSpecific.push(mainLocation);
      }
    }

    // Combine and limit
    const allHashtags = [...baseHashtags, ...jobSpecific];
    return allHashtags.slice(0, 8);
  }

  private generateSEOKeywords(job: Job): string[] {
    const keywords = [
      job.title,
      job.owner.companyName,
      job.locationAddress,
      job.type,
      job.owner.sector || '',
      'job',
      'career',
      'opportunity'
    ];

    // Add words from title
    const titleWords = job.title.split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3);

    return [...keywords, ...titleWords]
      .filter(k => k && k.length > 0)
      .slice(0, 10);
  }

  private generatePostText(job: Job, hashtags: string[]): string {
    const hashtagString = hashtags.map(t => `#${t}`).join(' ');
    const maxLength = config.content.maxTextLength;

    let text = `🚀 ${job.title}\n`;
    text += `🏢 ${job.owner.companyName}\n`;
    text += `📍 ${job.locationAddress}\n`;
    text += `💼 ${job.type}\n\n`;

    // Add brief description
    const briefDesc = job.description
      .replace(/<[^>]*>/g, '')
      .split('.')
      .slice(0, 2)
      .join('.')
      .slice(0, 100);

    if (briefDesc) {
      text += `${briefDesc}...\n\n`;
    }

    text += `👉 Apply now: ${job.url}\n\n`;
    text += hashtagString;

    // Truncate if too long
    if (text.length > maxLength) {
      text = text.slice(0, maxLength - 3) + '...';
    }

    return text;
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  }

  private getFallbackImage(job: Job): string {
    // Generate a branded image with job info
    const company = encodeURIComponent(job.owner.companyName);
    const title = encodeURIComponent(job.title);
    return `https://api.placeholder.com/1200x630/0b1a2f/ffffff?text=${title} at ${company}`;
  }
}