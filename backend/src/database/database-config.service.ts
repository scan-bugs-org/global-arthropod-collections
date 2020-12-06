import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

interface MongoConfig {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
}

@Injectable()
export class DatabaseConfigService {
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
}
