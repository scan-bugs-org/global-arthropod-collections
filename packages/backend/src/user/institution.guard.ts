import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from "./user.service";
import { TokenPayload } from "google-auth-library";

@Injectable()
export class InstitutionGuard implements CanActivate {
    constructor(private readonly users: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const user: TokenPayload = req.user;

        if (!user) {
            return false;
        }

        return this.users.isInstitutionEditor(req.params['id'], user.email);
    }
}
