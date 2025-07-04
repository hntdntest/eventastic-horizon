import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTabConfigToEvent20250704 implements MigrationInterface {
    name = 'AddTabConfigToEvent20250704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "tabConfig" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "tabConfig"`);
    }
}
