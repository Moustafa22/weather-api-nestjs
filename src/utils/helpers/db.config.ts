import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// For e2e testing, to make actual calls and changes on the db to test full scenarios and use-cases
export const DbConfigFactory = () => {
  const PostgresConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    password: process.env.POSTGRES_PASSWORD,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: process.env.APP_ENV == 'DEV',
    logging: true,
    autoLoadEntities: true,
  };

  // For e2e testing, to make actual calls and changes on the db to test full scenarios and use-cases

  const SqliteConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    autoLoadEntities: true,
    synchronize: true,
  };

  return process.env.TS_JEST ? SqliteConfig : PostgresConfig;
};
