import { Injectable, Provider } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { Connection, createConnection } from 'mongoose';

interface MongoConfig {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
}

async function databaseConnectionFactory(database: DatabaseService): Promise<Connection> {
    return createConnection(
        database.mongoUri(),
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
}

@Injectable()
export class DatabaseService {
    public static readonly PROVIDER_ID = 'DATABASE_PROVIDER';
    private readonly _mongoConfig: MongoConfig;

    constructor() {
        const dbConfigPath = path.join(process.cwd(), "config.json");
        const dbConfigContent = fs.readFileSync(dbConfigPath).toString('utf-8');
        this._mongoConfig = JSON.parse(dbConfigContent);
    }

    mongoUri(): string {
        let uri = `mongodb://${encodeURIComponent(this._mongoConfig.user)}:`;
        uri += `${encodeURIComponent(this._mongoConfig.password)}@`;
        uri += `${this._mongoConfig.host}:${this._mongoConfig.port}/`;
        uri += `${this._mongoConfig.database}`;
        return uri;
    }

    static getProvider(): Provider {
        return {
            provide: DatabaseService.PROVIDER_ID,
            useFactory: databaseConnectionFactory,
            inject: [DatabaseService]
        };
    }
}
