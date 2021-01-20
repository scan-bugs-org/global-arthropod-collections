import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "../database/database.module";
import { AppConfigModule } from "../app-config/app-config.module";
import { OAuth2Client } from "google-auth-library";
import { AppConfigService } from "../app-config/app-config.service";

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule
    ],
    providers: [
        UserService,
        {
            provide: OAuth2Client,
            useFactory: (appConfig) => {
                return new OAuth2Client(appConfig.googleClientID())
            },
            inject: [AppConfigService]
        }
    ],
    controllers: [UserController],
})
export class UserModule { }
