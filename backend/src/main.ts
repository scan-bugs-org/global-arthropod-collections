import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
    // Basic setup
    const port = parseInt(process.env.PORT) || 8080;
    const app = await NestFactory.create(AppModule);

    // Swagger UI
    const swaggerOpts = new DocumentBuilder()
        .setTitle('Global arthropod collections')
        .setVersion('1.0')
        .build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerOpts);

    // Start server
    SwaggerModule.setup('docs', app, swaggerDoc);
    app.use(helmet());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(
            app.get(Reflector),
            {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
                strategy: "excludeAll"
            }
        )
    );
    await app.listen(port);
}

bootstrap();
