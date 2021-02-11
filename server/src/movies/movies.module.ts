import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieRepository } from './movie.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MovieRepository])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [TypeOrmModule, MoviesService],
})
export class MoviesModule {}
