import { ApiProperty } from '@nestjs/swagger';

export class UploadInputDto {
    @ApiProperty({
        type: 'file',
        properties: {
            file: {
                type: 'string',
                format: 'binary'
            }
        }
    })
    readonly file;
}
