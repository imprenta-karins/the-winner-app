import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { port, apiPrefix } = await setupApp(app);
  console.log(`Backend running on http://localhost:${port}/${apiPrefix}`);
}
bootstrap();
