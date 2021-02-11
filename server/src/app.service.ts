import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movies/entities/movies.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
  ) {}
  getAllMovies(): string {
    throw new NotFoundException();
  }
}
