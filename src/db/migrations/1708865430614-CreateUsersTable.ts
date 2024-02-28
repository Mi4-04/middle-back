import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsersTable1708865430614 implements MigrationInterface {
  private table = new Table({
    name: 'users',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        default: 'uuid_generate_v4()',
      },
      {
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'password',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
