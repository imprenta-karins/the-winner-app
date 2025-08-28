import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import appConfig from '../config/app.config';

export async function setupApp(app: INestApplication) {
  const cfg = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.setGlobalPrefix(cfg.apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: cfg.apiVersion,
  });
  app.enableCors({ origin: cfg.corsOrigin });

  await app.listen(cfg.port);
  return cfg; // para loguear y usar en main.ts
}
