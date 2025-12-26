import { Injectable } from '@nestjs/common';
// Import ANIME directly
import { ANIME } from '@consumet/extensions'; 

@Injectable()
export class AnimeService {
  // If Gogoanime is missing, let's try 'Gogoanime' as a string or a direct class
  // But first, let's try to use a different provider to see if it fixes the error:
  // Try 'Zoro' (now called HiAnime) if Gogoanime is fighting you.
  private readonly provider = new ANIME.Gogoanime(); 
}

  // 1. Search for an anime (e.g., "Naruto")
  async search(query: string) {
    try {
      const results = await this.provider.search(query);
      return results;
    } catch (error) {
      return { error: 'Failed to search anime', details: error.message };
    }
  }

  // 2. Get details (Episodes, Description, Image)
  async getInfo(id: string) {
    try {
      const info = await this.provider.fetchAnimeInfo(id);
      return info;
    } catch (error) {
      return { error: 'Failed to get info', details: error.message };
    }
  }

  // 3. Get the actual video links
  async getLinks(episodeId: string) {
    try {
      const links = await this.provider.fetchEpisodeSources(episodeId);
      return links;
    } catch (error) {
      return { error: 'Failed to get video links', details: error.message };
    }
  }
}
