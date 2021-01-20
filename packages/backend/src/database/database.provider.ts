import { Provider } from "@nestjs/common";
import { Connection, createConnection } from "mongoose";
import { AppConfigService } from "../app-config/app-config.service";


async function databaseConnectionFactory(database: AppConfigService): Promise<Connection> {
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
    inject: [AppConfigService]
};
