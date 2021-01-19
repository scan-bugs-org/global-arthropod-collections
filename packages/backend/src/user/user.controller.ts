import {
    Controller,
    HttpCode,
    HttpStatus,
    Post, Req,
    UseInterceptors
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AppConfigService } from "../app-config/app-config.service";
import { GoogleAuthInterceptor } from "./google-auth.interceptor";

@Controller('login')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly appConfig: AppConfigService,
        private readonly user: UserService) { }

    @Post()
    @UseInterceptors(GoogleAuthInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK })
    async login(@Req() request): Promise<void> {
        console.log(request.user);
    }
}
