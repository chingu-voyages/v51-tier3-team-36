import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:5173'],
  });

  const config = new DocumentBuilder()
    .setTitle('Expense Splitter')
    .setDescription('Users and groups can handle expenses')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document)

  await app.listen(3000);

  // hot module replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

