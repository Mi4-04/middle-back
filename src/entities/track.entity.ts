import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Playlist } from './playlist.entity'

@Entity({ name: 'tracks' })
export class Track extends BaseEntity {
  constructor(
    params?: Partial<{
      realId: string
      name: string
      artist: string | null
      imageUrl: string | null
      audioUrl: string | null
      playlists: Playlist[]
    }>
  ) {
    super()
    Object.assign(this, params)
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'real_id', type: 'varchar', nullable: false })
  realId: string

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string

  @Column({ name: 'artist', type: 'varchar', nullable: true })
  artist: string | null

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null

  @Column({ name: 'audio_url', type: 'varchar', nullable: false })
  audioUrl: string

  @ManyToMany(() => Playlist, playlists => playlists.tracks)
  playlists: Playlist[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
