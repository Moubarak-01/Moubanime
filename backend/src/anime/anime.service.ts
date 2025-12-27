import { Injectable } from '@nestjs/common';
import { ANIME } from '@consumet/extensions';

@Injectable()
export class AnimeService {
  // Use Hianime (Zoro) since Gogoanime is not working
  private readonly provider = new ANIME.Hianime();

  async search(query: string) {
    try {
      const results = await this.provider.search(query);
      return results;
    } catch (error) {
      return { error: 'Failed to search anime', details: error.message };
    }
  }

  async getInfo(id: string) {
    try {
      const info = await this.provider.fetchAnimeInfo(id);
      return info;
    } catch (error) {
      return { error: 'Failed to get info', details: error.message };
    }
  }

  async getLinks(episodeId: string) {
    try {
      const links = await this.provider.fetchEpisodeSources(episodeId);
      return links;
    } catch (error) {
      return { error: 'Failed to get video links', details: error.message };
    }
  }
}