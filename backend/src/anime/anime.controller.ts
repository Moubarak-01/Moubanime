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

  @Get('info/:id')
  getAnimeInfo(@Param('id') id: string) {
    return this.animeService.getInfo(id);
  }

  @Get('watch/:episodeId')
  getEpisodeLinks(@Param('episodeId') episodeId: string) {
    return this.animeService.getLinks(episodeId);
  }

  // --- NEW SMART PROXY ENDPOINT ---
  // This downloads the video "Map" (m3u8), rewrites the instructions to point to localhost,
  // and sends it to the frontend. This tricks the browser into thinking the video is local.
  @Get('proxy')
  async proxyVideo(@Query('url') url: string, @Res() res: Response) {
    try {
      if (!url) return res.status(400).send('No URL provided');

      // 1. Fetch the content (Video Map or Video Chunk)
      const response = await axios.get(url, {
        responseType: 'arraybuffer', // Must be arraybuffer to handle binary video data
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://hianime.to/', // Trick the server into thinking we are them
        },
      });

      const contentType = response.headers['content-type'];
      
      // Allow the frontend to access this data
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
      });

      // 2. Check if it is a "Map" (playlist file / m3u8)
      // If it is, we MUST rewrite the links inside it.
      if (contentType.includes('application/vnd.apple.mpegurl') || url.includes('.m3u8')) {
        const originalBaseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        let manifest = response.data.toString('utf-8');

        // 3. REWRITE THE MAP: Find relative paths and point them back to this proxy
        // This Regex looks for lines that DON'T start with # (which are file paths)
        manifest = manifest.replace(/^(?!#)(.*)$/gm, (match) => {
          match = match.trim(); // Clean up whitespace
          
          // If it's already a full HTTP link, wrap it in our proxy
          if (match.startsWith('http')) {
            return `http://localhost:3000/anime/proxy?url=${encodeURIComponent(match)}`;
          }
          
          // If it's a relative link (e.g. "segment-1.ts"), combine with original base URL
          return `http://localhost:3000/anime/proxy?url=${encodeURIComponent(originalBaseUrl + match)}`;
        });

        res.send(manifest);
      } else {
        // 4. If it's just a raw video chunk (.ts), send it directly without changing it
        res.send(response.data);
      }

    } catch (error) {
      console.error('Proxy Error:', error.message);
      res.status(500).send('Failed to proxy video');
    }
  }
}