import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTabConfig1719999999999 implements MigrationInterface {
    name = 'CreateTabConfig1719999999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tab_config" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "key" character varying NOT NULL,
            "title" character varying NOT NULL,
            "description" character varying NOT NULL,
            "icon" character varying NOT NULL,
            "color" character varying NOT NULL,
            "order" integer NOT NULL DEFAULT 0,
            "isEnabled" boolean NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "UQ_tab_config_key" UNIQUE ("key"),
            CONSTRAINT "PK_tab_config_id" PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tab_config"`);
    }
}
