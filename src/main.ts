import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * PONTO DE ENTRADA DA APLICAÇÃO
 *
 * bootstrap() é uma função assíncrona que:
 * 1. Cria a aplicação NestJS
 * 2. Configura middlewares globais (segurança, compressão, validação)
 * 3. Gera a documentação Swagger
 * 4. Inicia o servidor HTTP
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ──────────────────────────────────────────────────────────────
  // SEGURANÇA: Helmet
  // Define cabeçalhos HTTP de segurança (X-Content-Type-Options,
  // Content-Security-Policy, etc.) — recomendado pelo OWASP.
  // ──────────────────────────────────────────────────────────────
  app.use(helmet());

  // ──────────────────────────────────────────────────────────────
  // COMPRESSÃO: Gzip
  // Reduz o tamanho das respostas HTTP, melhorando a performance.
  // ──────────────────────────────────────────────────────────────
  app.use(compression());

  // ──────────────────────────────────────────────────────────────
  // CORS (Cross-Origin Resource Sharing)
  // Permite que o frontend Angular (diferente domínio/porta)
  // consuma esta API.
  //
  // Em produção na Azure, substitua * pelo domínio real do frontend
  // para evitar que outros sites façam chamadas à sua API.
  // ──────────────────────────────────────────────────────────────
  const origensPermitidas = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:4200'];

  app.enableCors({
    origin: origensPermitidas,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ──────────────────────────────────────────────────────────────
  // PREFIXO GLOBAL DE ROTA
  // Todas as rotas ficam sob /api (ex.: /api/livros).
  // Isso facilita a configuração de proxy reverso na Azure.
  // ──────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ──────────────────────────────────────────────────────────────
  // VALIDAÇÃO GLOBAL (ValidationPipe)
  //
  // whitelist: true → remove automaticamente campos não declarados
  //   nos DTOs (proteção contra mass assignment).
  // forbidNonWhitelisted: true → retorna erro 400 se campos extras
  //   forem enviados (comportamento mais restritivo).
  // transform: true → converte os dados recebidos para os tipos
  //   declarados no DTO (ex.: string "2025" → number 2025).
  // ──────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ──────────────────────────────────────────────────────────────
  // SWAGGER — Documentação Interativa da API
  // Disponível em: http://localhost:3000/api/docs
  // Em produção, desabilite ou proteja com autenticação.
  // ──────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const configSwagger = new DocumentBuilder()
      .setTitle('Livraria API')
      .setDescription('API REST para gerenciamento de livros')
      .setVersion('1.0')
      .build();

    const documento = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api/docs', app, documento);
  }

  // ──────────────────────────────────────────────────────────────
  // INICIALIZAÇÃO DO SERVIDOR
  // A porta vem da variável PORT (definida pela Azure App Service)
  // ou 3000 como fallback para desenvolvimento local.
  // ──────────────────────────────────────────────────────────────
  const porta = parseInt(process.env.PORT || '3000', 10);
  await app.listen(porta, '0.0.0.0');

  console.log(`\n🚀 Servidor rodando em: http://localhost:${porta}/api`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Documentação Swagger: http://localhost:${porta}/api/docs`);
  }
}

bootstrap();
