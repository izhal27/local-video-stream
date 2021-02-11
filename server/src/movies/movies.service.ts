import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Movie } from './entities/movies.entity';
import { MovieDto } from './dto/movie-dto';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieRepository)
    private moviesRepository: MovieRepository,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({ order: { created_at: 'DESC' } });
  }

  async findAllWithDelete(): Promise<Movie[]> {
    const movies = await this.moviesRepository.findAllWithDelete();

    return (await movies).filter(m => m.deleted_at);
  }

  async findOneByTitle(title: string): Promise<Movie> {
    return this.moviesRepository.findOneByTitle(title);
  }

  async create(createMovieDto: MovieDto): Promise<Movie> {
    try {
      const movie = this.moviesRepository.create({ ...createMovieDto });
      return this.moviesRepository.save(movie);
    } catch (error) {
      console.log(error);
    }
  }

  async findOneById(id: string): Promise<Movie> {
    const movie = await this.moviesRepository.findOne(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async findOneBySlug(slug: string): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { slug } });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async update(id: string, createMovieDto: MovieDto): Promise<Movie> {
    let updateMovie = null;

    try {
      const foundMovie = await this.findOneById(id);
      updateMovie = this.moviesRepository.merge(foundMovie, {
        ...createMovieDto,
      });

      await this.moviesRepository.update(id, updateMovie);
    } catch (error) {
      console.log(error);
    }

    return updateMovie;
  }

  async softDelete(id: string) {
    return this.moviesRepository.softDelete(id);
  }

  async delete(id: string) {
    return this.moviesRepository.delete(id);
  }

  async restore(id: string) {
    return this.moviesRepository.restore(id);
  }
}
