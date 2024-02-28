import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTracksTable1709028033437 implements MigrationInterface {
  private table = new Table({
    name: 'tracks',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      },
      {
        name: 'track_id',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'name',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'artist',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'image_url',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'audio_url',
        type: 'varchar',
        isNullable: false,
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createIndex(
      this.table,
      new TableIndex({ name: 'track_index_name', columnNames: ['name'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table, true, true, true);
  }
}
