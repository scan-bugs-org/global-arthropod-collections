import { Module } from '@nestjs/common';
import { CollectionProvider } from './models/Collection';
import { InstitutionProvider } from './models/Institution';
import { TmpUploadProvider } from './models/TmpUpload';
import { UserProvider } from './models/User';
import { DatabaseProvider } from './database.provider';
import { OAuthTokenProvider } from "./models/OAuthToken";
import { AppConfigModule } from "../app-config/app-config.module";

@Module({
    imports: [AppConfigModule],
    providers: [
        DatabaseProvider,
        CollectionProvider,
        InstitutionProvider,
        TmpUploadProvider,
        UserProvider,
        OAuthTokenProvider
    ],
    exports: [
        CollectionProvider,
        InstitutionProvider,
        TmpUploadProvider,
        UserProvider,
        OAuthTokenProvider
    ]
})
export class DatabaseModule { }
