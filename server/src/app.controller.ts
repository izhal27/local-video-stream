import { Controller, Get, Render, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';
import { MoviesService } from './movies/movies.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly movieService: MoviesService,
  ) {}

  @Get()
  @Render('index')
  async root(@Res() res: Response) {
    const movies = await this.movieService.findAll();
    return { movies };
  }
}
