import { type MigrationInterface, type QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm'

export class CreatePlaylistsTracksTable1709028702520 implements MigrationInterface {
  private table = new Table({
    name: 'playlists_tracks',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        default: 'uuid_generate_v4()'
      },
      {
        name: 'playlist_id',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'track_id',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'created_at',
        type: 'timestamp with time zone',
        default: 'now()'
      },
      {
        name: 'updated_at',
        type: 'timestamp with time zone',
        default: 'now()'
      }
    ]
  })

  private playlistIdForeignKey = new TableForeignKey({
    name: 'playlist_id_foreign_key',
    columnNames: ['playlist_id'],
    referencedTableName: 'playlists',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  private trackIdForeignKey = new TableForeignKey({
    name: 'track_id_foreign_key',
    columnNames: ['track_id'],
    referencedTableName: 'tracks',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table)
    await queryRunner.createForeignKeys(this.table, [this.playlistIdForeignKey, this.trackIdForeignKey])
    await queryRunner.createIndices(this.table, [
      new TableIndex({
        name: 'playlist_id_index',
        columnNames: ['playlist_id']
      }),
      new TableIndex({
        name: 'track_id_index',
        columnNames: ['track_id']
      })
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table, true, true, true)
  }
}
