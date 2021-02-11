import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import slugify from 'slug';

export enum MovieType {
  Movie = 'movie',
  Serial = 'serial',
}

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500, unique: true })
  title: string;

  @Column({ length: 500 })
  comments: string;

  @Column({ length: 500 })
  genre: string;

  @Column('int', { unsigned: true })
  year: number;

  @Column('text')
  cast: string;

  @Column('text', { nullable: true })
  synopsis: string;

  @Column({ type: 'enum', enum: MovieType, default: MovieType.Movie })
  type: MovieType;

  @Column('int', { default: 0 })
  episode: number;

  @Column({ length: 500 })
  poster: string;

  @Column({ unique: true })
  slug: string;

  @BeforeUpdate()
  @BeforeInsert()
  createSlug() {
    this.slug = slugify(this.title);
  }

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
