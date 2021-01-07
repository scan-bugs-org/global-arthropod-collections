import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigService } from "../app-config/app-config.service";
import { AppConfigModule } from "../app-config/app-config.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        AppConfigModule,
        DatabaseModule,
        JwtModule.registerAsync({
            useFactory: (databaseConfigService: AppConfigService) => {
                return { secret: databaseConfigService.jwtKey() };
            },
            inject: [AppConfigService],
            imports: [AppConfigModule]
        })
    ],
    providers: [
        UserService,
        LocalStrategy,
        JwtStrategy
    ],
    controllers: [UserController],
})
export class UserModule { }
