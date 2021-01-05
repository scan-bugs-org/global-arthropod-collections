import {
    Body,
    Controller,
    HttpCode,
    HttpStatus, NotFoundException,
    Post, Req, UnauthorizedException, UseGuards
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginInputDto } from './dto/login.input.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Request } from "express";
import { LoginOutputDto } from "./dto/login.output.dto";

@Controller('users')
@ApiTags('User')
export class UserController {
    constructor(private readonly user: UserService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginInputDto })
    @ApiResponse({ status: HttpStatus.OK, type: LoginOutputDto })
    async login(@Req() request): Promise<LoginOutputDto> {
        const apiKey = await this.user.getApiKey(request.user);

        // if (!!apiKey) {
        //     throw new UnauthorizedException();
        // }

        return new LoginOutputDto({ apiKey });
    }
}
