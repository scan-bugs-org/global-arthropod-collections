import {
    CallHandler,
    ExecutionContext,
    Injectable, Logger,
    NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request, Response } from "express";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const method = request.method;
        const client = request.ip;
        const userAgent = request.get('User-Agent') || '';

        let fullUrl = `http${request.secure ? 's' : ''}://`;
        fullUrl += `${request.hostname}${request.originalUrl}`
        const url = new URL(fullUrl);

        response.on('finish', () => {
            const status = response.statusCode;
            const responseSize = response.get('Content-Length') || 0;
            const responseTime = `${Date.now() - startTime}ms`;

            let logMsg = `${method} ${url.pathname} ${status} - `;
            logMsg += `${client} ${userAgent} ${responseSize} ${responseTime}`;

            if (status < 200 || status > 399) {
                this.logger.warn(logMsg);
            }
            this.logger.log(logMsg);
        });

        return next.handle();
    }
}
