import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginInputDto {
    @ApiProperty()
    @IsString()
    _id: string;

    @ApiProperty()
    @IsString()
    password: string;
}
