import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1768754524038 implements MigrationInterface {
  name = 'Migration1768754524038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_history" ("id" uuid NOT NULL, "type" character varying NOT NULL, "user_id" integer NOT NULL, "game_id" integer NOT NULL, "body" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_0e74b90c56b815ed54e90a29f1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d09df292c60e6f9438f8492334" ON "game_history" ("game_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_d3c9ea1dae243cfc14e7a6968c" ON "game_history" ("created_at") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_d3c9ea1dae243cfc14e7a6968c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d09df292c60e6f9438f8492334"`);
    await queryRunner.query(`DROP TABLE "game_history"`);
  }
}
