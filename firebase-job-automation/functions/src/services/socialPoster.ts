// services/socialPoster.ts
import axios from 'axios';
import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config';
import { PostContent, SocialPostResult } from '../types';

export class SocialPoster {
  private facebookAccessToken: string;
  private facebookPageId: string;
  private twitterClient: TwitterApi;
  private telegramBotToken: string;
  private telegramChannelId: string;

  constructor() {
    this.facebookAccessToken = config.social.facebook.accessToken;
    this.facebookPageId = config.social.facebook.pageId;
    this.telegramBotToken = config.social.telegram.botToken;
    this.telegramChannelId = config.social.telegram.channelId;

    this.twitterClient = new TwitterApi({
      appKey: config.social.twitter.apiKey,
      appSecret: config.social.twitter.apiSecret,
      accessToken: config.social.twitter.accessToken,
      accessSecret: config.social.twitter.accessSecret,
    });
  }

  async postToFacebook(content: PostContent): Promise<SocialPostResult> {
    try {
      const url = `https://graph.facebook.com/${config.social.facebook.apiVersion}/${this.facebookPageId}/feed`;
      
      const payload: any = {
        message: content.text,
        link: content.url,
        access_token: this.facebookAccessToken,
        published: true
      };

      // Add image if available
      if (content.imageUrl) {
        payload.picture = content.imageUrl;
        payload.name = content.title;
        payload.description = content.description;
      }

      const response = await axios.post(url, payload);
      
      return {
        platform: 'facebook',
        success: true,
        postId: response.data.id,
        url: `https://facebook.com/${response.data.id}`
      };
    } catch (error: any) {
      console.error('Facebook post error:', error.response?.data || error.message);
      return {
        platform: 'facebook',
        success: false,
        error: error.message
      };
    }
  }

  async postToTwitter(content: PostContent): Promise<SocialPostResult> {
    try {
      // Twitter has 280 char limit
      const maxLength = 280;
      let text = content.text;
      
      if (text.length > maxLength) {
        text = text.slice(0, maxLength - 30) + `...\n\nApply: ${content.url}`;
      }

      // Add image if available
      let mediaId: string | undefined;
      if (content.imageUrl) {
        try {
          const imageResponse = await axios.get(content.imageUrl, { 
            responseType: 'arraybuffer' 
          });
          const imageBuffer = Buffer.from(imageResponse.data);
          
          const media = await this.twitterClient.v1.uploadMedia(imageBuffer, {
            mimeType: 'image/jpeg'
          });
          mediaId = media;
        } catch (error) {
          console.warn('Could not upload image to Twitter:', error);
        }
      }

      const tweet = await this.twitterClient.v2.tweet({
        text: text,
        ...(mediaId && { media: { media_ids: [mediaId] } })
      });

      return {
        platform: 'twitter',
        success: true,
        postId: tweet.data.id,
        url: `https://twitter.com/i/web/status/${tweet.data.id}`
      };
    } catch (error: any) {
      console.error('Twitter post error:', error);
      return {
        platform: 'twitter',
        success: false,
        error: error.message
      };
    }
  }

  async postToInstagram(content: PostContent): Promise<SocialPostResult> {
    try {
      // Instagram requires an image
      if (!content.imageUrl) {
        throw new Error('Image required for Instagram');
      }

      const url = `https://graph.facebook.com/${config.social.facebook.apiVersion}/${config.social.instagram.accountId}/media`;
      
      // Create media container
      const mediaResponse = await axios.post(url, {
        image_url: content.imageUrl,
        caption: content.text.slice(0, 2200),
        access_token: config.social.instagram.accessToken
      });

      // Publish the media
      const publishUrl = `https://graph.facebook.com/${config.social.facebook.apiVersion}/${config.social.instagram.accountId}/media_publish`;
      const publishResponse = await axios.post(publishUrl, {
        creation_id: mediaResponse.data.id,
        access_token: config.social.instagram.accessToken
      });

      return {
        platform: 'instagram',
        success: true,
        postId: publishResponse.data.id,
        url: `https://instagram.com/p/${publishResponse.data.id}`
      };
    } catch (error: any) {
      console.error('Instagram post error:', error.response?.data || error.message);
      return {
        platform: 'instagram',
        success: false,
        error: error.message
      };
    }
  }

  async postToTelegram(content: PostContent): Promise<SocialPostResult> {
    try {
      const message = this.formatTelegramMessage(content);
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;

      const response = await axios.post(url, {
        chat_id: this.telegramChannelId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            [{
              text: '🔗 Apply Now',
              url: content.url
            }]
          ]
        }
      });

      return {
        platform: 'telegram',
        success: true,
        postId: response.data.result.message_id.toString(),
        url: `https://t.me/${this.telegramChannelId}/${response.data.result.message_id}`
      };
    } catch (error: any) {
      console.error('Telegram post error:', error.response?.data || error.message);
      return {
        platform: 'telegram',
        success: false,
        error: error.message
      };
    }
  }

  async postToTikTok(content: PostContent): Promise<SocialPostResult> {
    try {
      // TikTok requires video or image with music
      // For now, we'll post a text-based content with link
      const url = 'https://open-api.tiktok.com/share/video/upload/';
      
      // Note: TikTok API requires video file upload
      // This is a simplified version
      const response = await axios.post(url, {
        access_token: config.social.tiktok.accessToken,
        open_id: config.social.tiktok.openId,
        text: content.text.slice(0, 150),
        ...(content.imageUrl && { cover_url: content.imageUrl })
      });

      return {
        platform: 'tiktok',
        success: true,
        postId: response.data.data.share_id,
        url: `https://tiktok.com/@${response.data.data.share_id}`
      };
    } catch (error: any) {
      console.error('TikTok post error:', error.response?.data || error.message);
      return {
        platform: 'tiktok',
        success: false,
        error: error.message
      };
    }
  }

  private formatTelegramMessage(content: PostContent): string {
    return `
<b>${content.title}</b>

🏢 <b>Company:</b> ${content.company}
📍 <b>Location:</b> ${content.location}
💼 <b>Type:</b> ${content.jobType}

${content.description}

🔗 <b>Apply:</b> ${content.url}

${content.hashtags.map(t => `#${t}`).join(' ')}
    `.trim();
  }

  async postToAllPlatforms(content: PostContent): Promise<SocialPostResult[]> {
    const results = await Promise.all([
      this.postToFacebook(content),
      this.postToTwitter(content),
      this.postToInstagram(content),
      this.postToTelegram(content),
      this.postToTikTok(content)
    ]);

    return results;
  }
}