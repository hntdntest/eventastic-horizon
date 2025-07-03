import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEventType1720000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'event_types',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', isGenerated: true },
                { name: 'key', type: 'varchar', isUnique: true },
                { name: 'name', type: 'varchar' },
                { name: 'description', type: 'varchar', isNullable: true },
                { name: 'tabs', type: 'text' }, // simple-json
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('event_types');
    }
}
