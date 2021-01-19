import {
    CallHandler,
    ExecutionContext,
    Injectable, Logger,
    NestInterceptor, UnauthorizedException
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
        try {
            const http = context.switchToHttp();
            const req = http.getRequest();

            if (!Object.keys(req.query).includes("id_token")) {
                throw new UnauthorizedException();
            }

            const idToken = req.query.id_token as string;
            const ticket = await this.oAuthClient.verifyIdToken({
                idToken,
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
