import {
    Body,
    Controller,
    HttpCode,
    HttpStatus, NotFoundException,
    Post, Req, Res, UnauthorizedException, UseGuards
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginInputDto } from './dto/login.input.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { LoginOutputDto } from "./dto/login.output.dto";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";

@Controller('login')
@ApiTags('User')
export class UserController {
    private static readonly REFRESH_EXPIRES_IN = "7d";
    private static readonly ACCESS_EXPIRES_IN = "1h";

    constructor(
        private readonly user: UserService,
        private readonly jwtService: JwtService) { }

    @Post()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginInputDto })
    @ApiResponse({ status: HttpStatus.OK })
    async login(@Req() request, @Res({ passthrough: true }) response: Response): Promise<LoginOutputDto> {
        const token = await this.user.createToken(request.user);

        const refreshToken = this.jwtService.sign(
            {
                sub: request.user,
                refreshToken: token.refreshToken
            },
            { expiresIn: UserController.REFRESH_EXPIRES_IN }
        );

        // TODO: HTTPS only
        response.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                maxAge: ms(UserController.REFRESH_EXPIRES_IN)
            }
        );

        return new LoginOutputDto({
            accessToken: this.jwtService.sign(
                {
                    sub: request.user,
                    accessToken: token.accessToken
                },
                { expiresIn: UserController.ACCESS_EXPIRES_IN }
            )
        });
    }
}
