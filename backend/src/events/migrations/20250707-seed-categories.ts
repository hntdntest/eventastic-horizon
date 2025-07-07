import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedCategories20250707 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO categories (id, name) VALUES
            (uuid_generate_v4(), 'Technology'),
            (uuid_generate_v4(), 'Music'),
            (uuid_generate_v4(), 'Sports'),
            (uuid_generate_v4(), 'Business'),
            (uuid_generate_v4(), 'Other')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM categories WHERE name IN ('Technology', 'Music', 'Sports', 'Business', 'Other')
        `);
    }
}
