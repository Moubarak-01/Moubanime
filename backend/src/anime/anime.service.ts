import { Injectable } from '@nestjs/common';
import { ANIME } from '@consumet/extensions';

@Injectable()
export class AnimeService {
  private readonly provider = new ANIME.Hianime();

  async search(query: string) {
    try {
      return await this.provider.search(query);
    } catch (error) {
      return { error: 'Failed to search anime', details: error.message };
    }
  }

  async getInfo(id: string) {
    try {
      return await this.provider.fetchAnimeInfo(id);
    } catch (error) {
      return { error: 'Failed to get info', details: error.message };
    }
  }

  // --- FIXED: ADDED (data as any) TO FIX TYPESCRIPT ERRORS ---
  async getLinks(episodeId: string) {
    try {
      const data = await this.provider.fetchEpisodeSources(episodeId);
      
      // CAST TO 'any': This stops the TS2339 error immediately
      const sourceData = data as any;

      if (sourceData.tracks) {
         const cleanSubtitles = sourceData.tracks
           .filter((track: any) => {
              const isSubtitle = track.kind === 'captions' || track.kind === 'subtitles';
              const hasUrl = track.file || track.url; 
              return isSubtitle && hasUrl;
           })
           .map((track: any) => ({
              url: track.file || track.url,
              lang: track.label || track.lang || 'English',
              kind: 'captions'
           }));

         sourceData.subtitles = cleanSubtitles;
      }

      return sourceData;
    } catch (error) {
      console.error("Link Fetch Error:", error);
      return { error: 'Failed to get video links', details: error.message };
    }
  }

  async getTrending() {
    try {
      const data = await this.provider.fetchSpotlight();
      const results = Array.isArray(data) ? data : data.results;
      
      const cleaned = results.map((anime: any) => ({
        id: anime.id,
        title: anime.title.english || anime.title || anime.name,
        image: anime.poster || anime.image, 
        banner: anime.banner || anime.cover || anime.poster || anime.image,
        description: anime.description,
        type: anime.type
      }));

      return { results: cleaned };
    } catch (error) {
      console.error("Trending Error:", error);
      return { results: [] }; 
    }
  }

  async getPopular() {
    try {
      const data = await this.provider.fetchMostPopular();
      const results = Array.isArray(data) ? data : data.results;

      const cleaned = results.map((anime: any) => ({
        id: anime.id,
        title: anime.title.english || anime.title || anime.name,
        image: anime.image || anime.poster, 
        episodeNumber: anime.episodeNumber || anime.totalEpisodes
      }));

      return { results: cleaned };
    } catch (error) {
      console.error("Popular Error:", error);
      return { results: [] };
    }
  }
}