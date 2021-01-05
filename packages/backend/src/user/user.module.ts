import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { LocalStrategy } from "./strategies/local.strategy";
import { ApiKeyStrategy } from "./strategies/api-key.strategy";

@Module({
    imports: [DatabaseModule],
    providers: [
        UserService,
        LocalStrategy,
        ApiKeyStrategy
    ],
    controllers: [UserController],
})
export class UserModule { }
