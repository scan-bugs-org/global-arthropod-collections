import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

@Injectable()
export class ObjectIdInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const request: Request = context.switchToHttp().getRequest();
        const params = Object.keys(request.params);

        if (params.includes('id') && !ObjectId.isValid(request.params.id)) {
            throw new BadRequestException('Invalid ObjectID');
        }
        return next.handle();
    }
}
