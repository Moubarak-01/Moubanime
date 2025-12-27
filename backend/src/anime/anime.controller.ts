import { Controller, Get, Query, Param, Res } from '@nestjs/common';
import { AnimeService } from './anime.service';
import type { Response } from 'express';
import axios from 'axios';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get('search')
  searchAnime(@Query('q') query: string) {
    return this.animeService.search(query);
  }

  // --- NEW ROUTES FOR HOME PAGE ---
  @Get('trending')
  getTrending() {
    return this.animeService.getTrending();
  }

  @Get('popular')
  getPopular() {
    return this.animeService.getPopular();
  }

  @Get('info/:id')
  getAnimeInfo(@Param('id') id: string) {
    return this.animeService.getInfo(id);
  }

  @Get('watch/:episodeId')
  getEpisodeLinks(@Param('episodeId') episodeId: string) {
    return this.animeService.getLinks(episodeId);
  }

  // --- THE SMART PROXY (Unchanged, critical for video) ---
  @Get('proxy')
  async proxyVideo(@Query('url') url: string, @Res() res: Response) {
    try {
      if (!url) return res.status(400).send('No URL provided');

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://hianime.to/',
        },
      });

      const contentType = response.headers['content-type'];
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      });

      if (contentType.includes('application/vnd.apple.mpegurl') || url.includes('.m3u8')) {
        const originalBaseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        let manifest = response.data.toString('utf-8');

        manifest = manifest.replace(/^(?!#)(.*)$/gm, (match) => {
          match = match.trim();
          if (match.startsWith('http')) {
            return `http://localhost:3000/anime/proxy?url=${encodeURIComponent(match)}`;
          }
          return `http://localhost:3000/anime/proxy?url=${encodeURIComponent(originalBaseUrl + match)}`;
        });

        res.send(manifest);
      } else {
        res.send(response.data);
      }

    } catch (error) {
      console.error('Proxy Error:', error.message);
      res.status(500).send('Failed to proxy video');
    }
  }
}