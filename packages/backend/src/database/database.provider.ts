import { Provider } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service';
import { Connection, createConnection } from 'mongoose';


async function databaseConnectionFactory(database: DatabaseConfigService): Promise<Connection> {
    return createConnection(
        database.mongoUri(),
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    );
}

export const DATABASE_PROVIDER_ID = 'DATABASE_PROVIDER';

export const DatabaseProvider: Provider = {
    provide: DATABASE_PROVIDER_ID,
    useFactory: databaseConnectionFactory,
    inject: [DatabaseConfigService]
};
