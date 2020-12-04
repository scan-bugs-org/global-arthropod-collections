import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CollectionProvider } from './models/Collection';
import { InstitutionProvider } from './models/Institution';
import { TmpUploadProvider } from './models/TmpUpload';
import { UserProvider } from './models/User';

const databaseProvider = DatabaseService.getProvider();

@Module({
    providers: [
        DatabaseService,
        databaseProvider,
        CollectionProvider,
        InstitutionProvider,
        TmpUploadProvider,
        UserProvider
    ],
    exports: [
        CollectionProvider,
        InstitutionProvider,
        TmpUploadProvider,
        UserProvider
    ]
})
export class DatabaseModule { }
