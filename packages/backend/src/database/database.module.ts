import { Module } from "@nestjs/common";
import { CollectionProvider } from "./models/Collection";
import { InstitutionProvider } from "./models/Institution";
import { TmpUploadProvider } from "./models/TmpUpload";
import { UserProvider } from "./models/User";
import { DatabaseProvider } from "./database.provider";
import { AppConfigModule } from "../app-config/app-config.module";

@Module({
    imports: [AppConfigModule],
    providers: [
        DatabaseProvider,
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
