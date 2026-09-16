import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1789571341397 implements MigrationInterface {
  name = 'CreateUsersTable1789571341397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'passwordHash', type: 'varchar' },
          { name: 'avatar', type: 'varchar' },
          { name: 'isConfirm', type: 'boolean', default: false },
          { name: 'isTwoFa', type: 'boolean', default: false },
          { name: 'loginAt', type: 'timestamptz', isNullable: true },
          { name: 'bannedAt', type: 'timestamptz', isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Seed the demo admin user (username "admin", password "changeme") so
    // the existing demo login credentials keep working against the real
    // table. Remove once real signup/user-management exists.
    await queryRunner.query(
      `INSERT INTO "users" ("username", "passwordHash", "avatar", "isConfirm")
       VALUES ('admin', '$2b$10$QJSMwvnPo.WYp34Gu1AmreU6FO2DLvuKdIomJ0g.H0ZFWwndWXQLK', '', true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
