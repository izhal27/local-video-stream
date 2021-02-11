import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { TitleAlreadyExistConstraint } from './title-already-exist';
import { Movie, MovieType } from '../entities/movies.entity';
import { Type } from 'class-transformer';

export class MovieDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @Validate(TitleAlreadyExistConstraint, [Movie])
  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  comments: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @Max(3000)
  @Min(1)
  @Type(() => Number)
  @IsInt()
  year: number;

  @IsString()
  @IsNotEmpty()
  cast: string;

  @IsString()
  @IsOptional()
  synopsis: string;

  @IsOptional()
  type: MovieType;

  @Max(100)
  @Min(1)
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  episode: number;

  @IsNotEmpty()
  @IsString()
  poster: string;
}
