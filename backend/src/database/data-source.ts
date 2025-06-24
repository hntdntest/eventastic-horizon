import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: (process.env.DATABASE_TYPE as any) || 'mysql', // Đảm bảo có giá trị mặc định và ép kiểu phù hợp
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  logging: process.env.NODE_ENV !== 'production',
  entities: ['src/**/*.entity.{ts,js}'],
  migrations: ['src/database/migrations/**/*.{ts,js}'],
});
