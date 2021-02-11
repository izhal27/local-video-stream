import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';
import { MoviesModule } from './movies/movies.module';
import { PlayModule } from './play/play.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE || 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MoviesModule,
    PlayModule,
  ],
  controllers: [AppController, MoviesController],
  providers: [AppService, MoviesService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
