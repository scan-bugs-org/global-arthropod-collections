import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';
import { CollectionModule } from './collection/collection.module';
import { UploadModule } from './upload/upload.module';
import { ObjectIdInterceptor } from './common/object-id.interceptor';
import { CommonModule } from './common/common.module';

@Module({
    imports: [
        UserModule,
        InstitutionModule,
        CollectionModule,
        UploadModule
    ]
})
export class AppModule {
}
