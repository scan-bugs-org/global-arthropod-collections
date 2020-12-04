import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

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
    await app.listen(port);
}

bootstrap();
