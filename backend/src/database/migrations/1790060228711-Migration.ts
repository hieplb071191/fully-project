import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1790060228711 implements MigrationInterface {
    name = 'Migration1790060228711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isFullPermission" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isFullPermission"`);
    }

}
