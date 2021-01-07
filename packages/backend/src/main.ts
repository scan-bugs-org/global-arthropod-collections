import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from "./logger.interceptor";

const CURRENT_VERSION = "v1";

async function bootstrap() {
    // Basic setup
    const port = parseInt(process.env.PORT) || 8080;
    const env = process.env.NODE_ENV;

    // Define the app
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(`api/${CURRENT_VERSION}`)
    app.use(helmet());
    app.getHttpAdapter().enableCors({ origin: "*", credentials: true })

    // Set up app globals
    app.useGlobalInterceptors(
        new LoggerInterceptor(),
        new ClassSerializerInterceptor(
            app.get(Reflector),
            {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
                strategy: "excludeAll"
            }
        )
    );
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );

    // Set up docs
    if (env === 'development') {
        const swaggerOpts = new DocumentBuilder()
            .setTitle('Global arthropod collections')
            .setVersion('1.0')
            .addApiKey({ type: "apiKey", name: 'Authorization' }, 'Authorization')
            .build();

        const swaggerDoc = SwaggerModule.createDocument(app, swaggerOpts);
        SwaggerModule.setup('docs', app, swaggerDoc);
    }

    // Start app
    await app.listen(port);
}

bootstrap();
