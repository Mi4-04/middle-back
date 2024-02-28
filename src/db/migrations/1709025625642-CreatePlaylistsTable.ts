import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePlaylistsTable1709025625642 implements MigrationInterface {
  private table = new Table({
    name: 'playlists',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      },
      {
        name: 'name',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      },
      {
        name: 'created_at',
        type: 'timestamp with time zone',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp with time zone',
        default: 'now()',
      },
    ],
  });

  private userIdForeignKey = new TableForeignKey({
    name: 'user_id_foreign_key',
    columnNames: ['user_id'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.userIdForeignKey);
    await queryRunner.createIndex(
      this.table,
      new TableIndex({ name: 'playlist_index_name', columnNames: ['name'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table, true, true, true);
  }
}
