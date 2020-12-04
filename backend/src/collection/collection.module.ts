import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { DatabaseModule } from '../database/database.module';
import { CheckInstitutionPipe } from './check-institution.pipe';

@Module({
    imports: [DatabaseModule],
    providers: [
        CollectionService,
        CheckInstitutionPipe
    ],
    controllers: [CollectionController],
})
export class CollectionModule { }
