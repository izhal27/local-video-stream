import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getManager, Not } from 'typeorm';
import { Movie } from '../entities/movies.entity';
import { MovieDto } from './movie-dto';

@ValidatorConstraint({ async: true })
export class TitleAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  async validate(title: string, args: ValidationArguments) {
    let search: Object;
    const dto = args.object as MovieDto;
    const repo = getManager().getRepository(args.constraints[0]);

    if (dto.id) {
      search = {
        where: { title, id: Not(dto.id) },
      };
    } else {
      search = {
        where: { title },
      };
    }

    const existingMovie = (await repo.findOne(search)) as Movie;
    return !!!existingMovie;
  }

  defaultMessage(_: ValidationArguments) {
    return `Movie with title "$value" already exists in current database`;
  }
}
