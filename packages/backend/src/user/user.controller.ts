import {
    Body,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginInputDto } from './login.input.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
    constructor(private readonly user: UserService) { }

    @Post('login')
    @HttpCode(HttpStatus.NO_CONTENT)
    async login(@Body() loginData: LoginInputDto): Promise<void> {
        const user = await this.user.findByUsername(loginData._id);
        if (!user) {
            throw new ForbiddenException();
        }

        if (!await user.verifyPassword(loginData.password)) {
            throw new ForbiddenException();
        }
    }
}
