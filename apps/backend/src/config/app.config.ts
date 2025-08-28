import { registerAs } from '@nestjs/config';

function parseOrigin(input?: string) {
  if (!input || input === '*') return true as const; // CORS abierto
  return input.split(',').map(s => s.trim());        // lista de orígenes
}

export default registerAs('app', () => ({
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiVersion: process.env.API_VERSION ?? '1',
  corsOrigin: parseOrigin(process.env.CORS_ORIGIN ?? '*'),
}));
