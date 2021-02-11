import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { Movie, MovieType } from './entities/movies.entity';
import { MovieDto } from './dto/movie-dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesServices: MoviesService) {}

  @Get('/create')
  async createForm(
    @Param('id', ValidationPipe) id: string,
    @Res() res: Response,
  ) {
    if (id) {
      const currentValue = await this.moviesServices.findOneById(id);

      return res.render('form', { currentValue });
    }

    res.render('form');
  }

  @Post('/create')
  async create(@Body() dto: MovieDto, @Res() res: Response) {
    const validationResult = await validate(plainToClass(MovieDto, dto));

    if (validationResult.length > 0) {
      const errors = validationResult
        .map(val => ({
          [val.property]: val.constraints,
        }))
        .reduce((curr, acc) => ({ ...curr, ...acc }), {});

      console.log(errors);

      return res.render('form', { errors: errors, currentValue: dto });
    }

    await this.moviesServices.create(dto);
    res.redirect('/movies/manage');
  }

  @Get('/:id/update')
  async updateForm(
    @Param('id', ValidationPipe) id: string,
    @Res() res: Response,
  ) {
    const currentValue = await this.moviesServices.findOneById(id);

    return res.render('form', { currentValue });
  }

  @Post('/:id/update')
  async update(
    @Body('id', ValidationPipe) id: string,
    @Body() dto: MovieDto,
    @Res() res: Response,
  ): Promise<void> {
    const movieDto = plainToClass(MovieDto, { id, ...dto });
    const validationResult = await validate(movieDto);

    if (validationResult.length > 0) {
      const errors = validationResult
        .map(val => ({
          [val.property]: val.constraints,
        }))
        .reduce((curr, acc) => ({ ...curr, ...acc }), {});

      console.log(errors);

      return res.render('form', { errors: errors, currentValue: dto });
    }

    if (movieDto.type === MovieType.Movie && movieDto.episode > 1) {
      movieDto.episode = 1;
    }

    await this.moviesServices.update(id, movieDto);
    res.redirect('/movies/manage');
  }

  @Get('/manage/trash')
  @Render('table-movies-trash')
  async manageTrashMovies() {
    const movies = await this.moviesServices.findAllWithDelete();

    return { movies };
  }

  @Get('/manage')
  @Render('table-movies')
  manageMovies() {
    return this.listMovies();
  }

  @Get('/show/:slug/:ep?')
  @Render('show')
  async getMovieById(
    @Param('slug', ValidationPipe) slug: string,
    @Param('ep', new DefaultValuePipe(0), ParseIntPipe) ep: number,
  ): Promise<{ movie: Movie; ep: number }> {
    const movie = await this.moviesServices.findOneBySlug(slug);

    return { movie, ep };
  }

  @Post('/soft/delete')
  async softDelete(
    @Body('id', ValidationPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.moviesServices.softDelete(id);
    res.redirect('/movies/manage');
  }

  @Post('/delete')
  async delete(
    @Body('id', ValidationPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.moviesServices.delete(id);
    res.redirect('/movies/manage/trash');
  }

  @Get('/:id/restore')
  async restore(
    @Param('id', ValidationPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.moviesServices.restore(id);
    res.redirect('/movies/manage/trash');
  }

  @Get('/')
  @Render('list-movies')
  async listMovies(): Promise<{ movies: Movie[] }> {
    const movies = await this.moviesServices.findAll();

    return { movies };
  }
}
