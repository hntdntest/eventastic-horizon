import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSponsorshipLevelEntity20250703 implements MigrationInterface {
    name = 'AddSponsorshipLevelEntity20250703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sponsorship_levels" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "sortOrder" integer NOT NULL DEFAULT 0,
                "event_id" uuid NOT NULL,
                CONSTRAINT "PK_sponsorship_levels_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_sponsorship_levels_event" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sponsorship_levels"`);
    }
}
