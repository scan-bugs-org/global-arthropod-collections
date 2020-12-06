import { Module } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';
import { DatabaseModule } from '../database/database.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CommonModule,
        DatabaseModule
    ],
    providers: [InstitutionService],
    controllers: [InstitutionController],
})
export class InstitutionModule {
}
