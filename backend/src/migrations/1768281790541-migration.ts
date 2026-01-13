import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768281790541 implements MigrationInterface {
    name = 'Migration1768281790541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_scenes" DROP CONSTRAINT "FK_39e909bff4fecd9fb7d5033d42c"`);
        await queryRunner.query(`ALTER TABLE "game_scenes" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "game_scenes" ADD CONSTRAINT "FK_39e909bff4fecd9fb7d5033d42c" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_scenes" DROP CONSTRAINT "FK_39e909bff4fecd9fb7d5033d42c"`);
        await queryRunner.query(`ALTER TABLE "game_scenes" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "game_scenes" ADD CONSTRAINT "FK_39e909bff4fecd9fb7d5033d42c" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
