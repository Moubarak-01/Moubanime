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

  async getLinks(episodeId: string) {
    try {
      return await this.provider.fetchEpisodeSources(episodeId);
    } catch (error) {
      return { error: 'Failed to get video links', details: error.message };
    }
  }

  // --- FIXED: CLEANING DATA FOR FRONTEND ---
  async getTrending() {
    try {
      const data = await this.provider.fetchSpotlight();
      const results = Array.isArray(data) ? data : data.results;
      
      // Clean the data: Ensure 'image' and 'banner' always exist
      const cleaned = results.map((anime: any) => ({
        id: anime.id,
        title: anime.title.english || anime.title || anime.name,
        // Hianime sends 'poster' for trending, but we force it to be 'image'
        image: anime.poster || anime.image, 
        // Grab the wide banner if available
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
        image: anime.image || anime.poster, // Fallback logic
        episodeNumber: anime.episodeNumber || anime.totalEpisodes
      }));

      return { results: cleaned };
    } catch (error) {
      console.error("Popular Error:", error);
      return { results: [] };
    }
  }
}