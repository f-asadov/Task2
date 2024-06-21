import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config()


export const dbConfig:DataSourceOptions = {
    type:'postgres',
    host:process.env.DB_HOST,
    port:+process.env.DB_PORT,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize:true, //only for development
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    
}

const dataSource = new DataSource(dbConfig);
export default dataSource;
