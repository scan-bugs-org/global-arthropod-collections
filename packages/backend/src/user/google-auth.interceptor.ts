import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
    UnauthorizedException
} from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { AppConfigService } from "../app-config/app-config.service";

@Injectable()
export class GoogleAuthInterceptor implements NestInterceptor {
    private logger = new Logger(GoogleAuthInterceptor.name);

    constructor(
        private readonly appConfig: AppConfigService,
        private readonly oAuthClient: OAuth2Client) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        const http = context.switchToHttp();
        const req = http.getRequest();

        if (!Object.keys(req.headers).includes("Authorization")) {
            throw new UnauthorizedException();
        }

        const authHeader = req.headers['Authorization'] as string;
        const bearerToken = authHeader
            .replace(/^\s*Bearer\s+/, "")
            .replace(/\s*$/, "");

        console.log(bearerToken);

        try {
            const ticket = await this.oAuthClient.verifyIdToken({
                idToken: bearerToken,
                audience: this.appConfig.googleClientID()
            });

            req.user = ticket.getPayload();

            return next.handle();
        }
        catch (e) {
            this.logger.error(JSON.stringify(e));
            throw new UnauthorizedException();
        }
    }
}
