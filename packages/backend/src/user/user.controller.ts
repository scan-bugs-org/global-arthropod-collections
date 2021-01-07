import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus, NotFoundException,
    Post, Req, Res, UnauthorizedException, UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginInputDto } from './dto/login.input.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Request, response, Response } from "express";
import { LoginOutputDto } from "./dto/login.output.dto";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AppConfigService } from "../app-config/app-config.service";
import { OAuthToken } from "../database/models/OAuthToken";
import { LeanDocument } from "mongoose";

@Controller('login')
@ApiTags('User')
export class UserController {
    private static readonly REFRESH_EXPIRES_IN = "7d";
    private static readonly ACCESS_EXPIRES_IN = "1h";

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly jwt: JwtService,
        private readonly user: UserService) { }

    @Post()
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginInputDto })
    @ApiResponse({ status: HttpStatus.OK, type: LoginOutputDto })
    async login(@Req() request, @Res({ passthrough: true }) response: Response): Promise<LoginOutputDto> {
        const token = await this.user.createToken(request.user);
        return this.sendTokens(request.user, token, response);
    }

    @Get('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: HttpStatus.OK, type: LoginOutputDto })
    async refreshUser(@Req() request: Request, @Res({ passthrough: true }) response): Promise<LoginOutputDto> {
        if (!request.cookies.refreshToken) {
            throw new UnauthorizedException();
        }

        try {
            this.jwt.verify(
                request.cookies.refreshToken,
                { secret: this.appConfig.jwtKey() }
            );

        } catch (e) {
            throw new UnauthorizedException();
        }

        const cookieData = this.jwt.decode(request.cookies.refreshToken);
        const userId = cookieData['sub'];
        const refreshToken = cookieData['refreshToken'];

        const token = await this.user.findRefreshToken(userId, refreshToken);

        if (!token) {
            throw new UnauthorizedException();
        }

        await this.user.deleteRefreshToken(userId, refreshToken);

        const newToken = await this.user.createToken(userId);
        return this.sendTokens(userId, newToken, response);
    }

    private sendTokens(username: string, token: OAuthToken | LeanDocument<OAuthToken>, response: Response) {
        const refreshToken = this.jwt.sign(
            {
                sub: username,
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
            accessToken: this.jwt.sign(
                {
                    sub: username,
                    accessToken: token.accessToken
                },
                { expiresIn: UserController.ACCESS_EXPIRES_IN }
            )
        });
    }
}
