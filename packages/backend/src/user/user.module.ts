import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [DatabaseModule],
    providers: [
        UserService,
        LocalStrategy
    ],
    controllers: [UserController],
})
export class UserModule { }
