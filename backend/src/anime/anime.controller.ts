import { Controller, Get, Query, Param } from '@nestjs/common';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  // URL: http://localhost:3000/anime/search?q=naruto
  @Get('search')
  searchAnime(@Query('q') query: string) {
    return this.animeService.search(query);
  }

  // URL: http://localhost:3000/anime/info/one-piece
  @Get('info/:id')
  getAnimeInfo(@Param('id') id: string) {
    return this.animeService.getInfo(id);
  }

  // URL: http://localhost:3000/anime/watch/one-piece-episode-1
  @Get('watch/:episodeId')
  getEpisodeLinks(@Param('episodeId') episodeId: string) {
    return this.animeService.getLinks(episodeId);
  }
}