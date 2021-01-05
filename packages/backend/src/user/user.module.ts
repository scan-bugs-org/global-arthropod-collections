import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [DatabaseModule],
    providers: [
        UserService,
        LocalStrategy,
        LocalAuthGuard
    ],
    controllers: [UserController],
})
export class UserModule { }
