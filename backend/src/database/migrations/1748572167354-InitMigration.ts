import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1748572167354 implements MigrationInterface {
  name = 'InitMigration1748572167354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`status\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`size\` int NULL DEFAULT '0', \`metadata\` json NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL DEFAULT 'email', \`socialId\` varchar(255) NULL, \`firstName\` varchar(255) NULL, \`lastName\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`photoId\` int NULL, \`roleId\` int NULL, \`statusId\` int NULL, INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` (\`socialId\`), INDEX \`IDX_58e4dbff0e1a32a9bdc861bb29\` (\`firstName\`), INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` (\`lastName\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`REL_75e2be4ce11d447ef43be0e374\` (\`photoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`hash\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`userId\` int NULL, INDEX \`IDX_3d2f174ef04fb312fdebd0ddc5\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pass_code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`pass_code\` varchar(6) NOT NULL, \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_b1528ba0555508cae8b02ff31a\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, \`endTime\` datetime NOT NULL, \`startTime\` datetime NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_75e2be4ce11d447ef43be0e374f\` FOREIGN KEY (\`photoId\`) REFERENCES \`file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_dc18daa696860586ba4667a9d31\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_01cd2b829e0263917bf570cb672\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_01cd2b829e0263917bf570cb672\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_dc18daa696860586ba4667a9d31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_75e2be4ce11d447ef43be0e374f\``,
    );
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b1528ba0555508cae8b02ff31a\` ON \`pass_code\``,
    );
    await queryRunner.query(`DROP TABLE \`pass_code\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3d2f174ef04fb312fdebd0ddc5\` ON \`session\``,
    );
    await queryRunner.query(`DROP TABLE \`session\``);
    await queryRunner.query(
      `DROP INDEX \`REL_75e2be4ce11d447ef43be0e374\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f0e1b4ecdca13b177e2e3a0613\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_58e4dbff0e1a32a9bdc861bb29\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`file\``);
    await queryRunner.query(`DROP TABLE \`status\``);
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
