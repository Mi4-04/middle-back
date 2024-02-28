import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ name: 'password', nullable: false, type: 'varchar' })
  password: string;

  @OneToMany(() => Playlist, (playlists) => playlists.user, { cascade: true })
  playlists: Playlist[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
