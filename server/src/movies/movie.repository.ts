import { Movie } from './entities/movies.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Movie)
export class MovieRepository extends Repository<Movie> {
  findOneByTitle(title: string): Promise<Movie> {
    return this.findOne({ where: { title } });
  }

  findAllWithDelete(): Promise<Movie[]> {
    return this.find({
      withDeleted: true,
      order: { deleted_at: 'DESC' },
    });
  }
}
