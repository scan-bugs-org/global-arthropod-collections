import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post, UseGuards
} from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { LoginInputDto } from './login.input.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('users')
@ApiTags('User')
export class UserController {
    constructor(private readonly user: UserService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async login(@Body() loginData: LoginInputDto): Promise<void> {

    }
}
