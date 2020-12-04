import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { InstitutionModule } from './institution/institution.module';

@Module({
  imports: [UserModule, InstitutionModule]
})
export class AppModule {}
