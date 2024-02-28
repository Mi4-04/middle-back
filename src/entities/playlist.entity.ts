import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Track } from './track.entity';
import { User } from './user.entity';

@Entity({ name: 'playlists' })
export class Playlist extends BaseEntity {
  constructor(
    params?: Partial<{
      name: string;
      user?: User | null;
      tracks: Track[];
    }>,
  ) {
    super();
    Object.assign(this, params);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  @ManyToMany(() => Track, (tracks) => tracks.playlists, { cascade: true })
  @JoinTable({
    name: 'playlists_tracks',
    joinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'track_id',
      referencedColumnName: 'id',
    },
  })
  tracks: Track[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
