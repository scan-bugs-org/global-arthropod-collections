import { Module } from '@nestjs/common';
import { ObjectIdInterceptor } from './object-id.interceptor';

@Module({
    providers: [ObjectIdInterceptor],
    exports: [ObjectIdInterceptor]
})
export class CommonModule {}
