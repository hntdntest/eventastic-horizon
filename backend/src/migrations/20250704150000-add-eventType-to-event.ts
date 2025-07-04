import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventTypeToEvent20250704150000 implements MigrationInterface {
    name = 'AddEventTypeToEvent20250704150000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "eventType" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "eventType"`);
    }
}
