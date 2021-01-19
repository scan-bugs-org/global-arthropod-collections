import { Injectable } from '@nestjs/common';
import path from "path";
import fs from "fs";

interface AppConfig {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    googleClientID: string;
    initialAdminUser: string;
}

@Injectable()
export class AppConfigService {
    private readonly appConfig: AppConfig;

    constructor() {
        const dbConfigPath = path.join(process.cwd(), "config.json");
        const dbConfigContent = fs.readFileSync(dbConfigPath).toString('utf-8');
        this.appConfig = JSON.parse(dbConfigContent);
    }

    mongoUri(): string {
        let uri = `mongodb://${encodeURIComponent(this.appConfig.user)}:`;
        uri += `${encodeURIComponent(this.appConfig.password)}@`;
        uri += `${this.appConfig.host}:${this.appConfig.port}/`;
        uri += `${this.appConfig.database}`;
        return uri;
    }

    googleClientID(): string {
        return this.appConfig.googleClientID;
    }

    initialAdminUser(): string {
        return this.appConfig.initialAdminUser;
    }
}
