import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1789741684494 implements MigrationInterface {
  name = 'Migration1789741684494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."source_login_enum" AS ENUM('GOOGLE', 'USER', 'FACEBOOK', 'TWITTER', 'TIKTOK')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "avatar" character varying NOT NULL, "sourceLogin" "public"."source_login_enum" NOT NULL DEFAULT 'USER', "isConfirm" boolean NOT NULL DEFAULT false, "isTwoFa" boolean NOT NULL DEFAULT false, "loginAt" TIMESTAMP WITH TIME ZONE, "bannedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."source_login_enum"`);
  }
}
