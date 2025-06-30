import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoverImageToEvent20250630 implements MigrationInterface {
    name = 'AddCoverImageToEvent20250630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "coverImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "coverImage"`);
    }
}
