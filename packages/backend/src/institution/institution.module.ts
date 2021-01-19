import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { DatabaseModule } from '../database/database.module';
import { CommonModule } from '../common/common.module';
import { AppConfigModule } from "../app-config/app-config.module";

@Module({
    imports: [
        CommonModule,
        DatabaseModule,
        AppConfigModule,
    ],
    providers: [InstitutionService],
    controllers: [InstitutionController],
})
export class InstitutionModule {
}
