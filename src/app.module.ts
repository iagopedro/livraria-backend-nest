import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivrosModule } from './livros/livros.module';
import { HealthController } from './health/health.controller';
import databaseConfig from './config/database.config';

/**
 * APP MODULE — Módulo Raiz da Aplicação
 *
 * Este é o ponto de entrada do grafo de dependências do NestJS.
 * Tudo que é importado aqui fica disponível para toda a aplicação.
 *
 * Fluxo de inicialização:
 * main.ts → NestFactory.create(AppModule) → NestJS analisa este módulo
 * → instancia todos os providers → sobe o servidor HTTP
 */
@Module({
  imports: [
    /**
     * ConfigModule: carrega variáveis de ambiente do arquivo .env.
     * isGlobal: true → disponível em todos os módulos sem precisar
     *           importá-lo novamente.
     * load: [databaseConfig] → registra a configuração de banco.
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),

    /**
     * TypeOrmModule.forRootAsync:
     * Configura o banco de dados de forma assíncrona, aguardando
     * o ConfigService carregar o .env antes de conectar.
     *
     * Isso evita condições de corrida onde o banco tentaria conectar
     * antes das variáveis de ambiente estarem disponíveis.
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        // Recupera o objeto de configuração registrado em database.config.ts
        config.get('database'),
    }),

    // Registra o módulo de livros
    LivrosModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
