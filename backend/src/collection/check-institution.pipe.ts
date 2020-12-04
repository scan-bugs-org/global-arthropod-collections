import {
    Injectable,
    ArgumentMetadata,
    PipeTransform,
    Inject, BadRequestException,
} from '@nestjs/common';
import { CollectionInputDto } from './dto/collection.input.dto';
import { Model } from 'mongoose';
import {
    Institution,
    INSTITUTION_PROVIDER_ID,
} from '../database/models/Institution';

@Injectable()
export class CheckInstitutionPipe implements PipeTransform {
    constructor(
        @Inject(INSTITUTION_PROVIDER_ID)
        private readonly institution: Model<Institution>) { }

    async transform(values: CollectionInputDto | CollectionInputDto[], metadata: ArgumentMetadata) {
        const origValues = values;

        if (metadata.type !== 'body') {
            return origValues;
        }

        if (!Array.isArray(values)) {
            values = [{ ...values }];
        }

        for (const value of values) {
            const iid = value.institution;
            if (!iid) {
                continue;
            }

            const institution = await this.institution.findById(iid, { _id: 1 }).exec();
            if (!institution) {
                throw new BadRequestException(`No institution with id ${iid}`);
            }
        }

        return origValues;
    }
}
