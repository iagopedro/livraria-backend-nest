import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Livro } from '../livros/entities/livro.entity';

/**
 * registerAs('database', () => ...):
 * Registra este objeto de configuração sob o namespace 'database'.
 * Outros arquivos podem injetá-lo com @Inject('database') ou
 * ConfigService.get('database').
 *
 * Estratégia de banco por ambiente:
 * ┌─────────────────┬──────────────────────────────────────────┐
 * │ Ambiente        │ Banco                                    │
 * ├─────────────────┼──────────────────────────────────────────┤
 * │ development     │ SQLite (arquivo local, zero configuração) │
 * │ test            │ SQLite em memória (:memory:)              │
 * │ production      │ Azure SQL (SQL Server via mssql)          │
 * └─────────────────┴──────────────────────────────────────────┘
 */
export default registerAs('database', (): TypeOrmModuleOptions => {
  const env = process.env.NODE_ENV || 'development';

  // ────────────────────────────────────────────
  // PRODUÇÃO: Azure SQL (SQL Server)
  // ────────────────────────────────────────────
  if (env === 'production') {
    return {
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Livro],
      // synchronize: false em produção!
      // Em produção, use migrations para alterar o banco com segurança.
      // "synchronize: true" pode apagar dados ao mudar a entidade.
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      options: {
        // Exigido pela Azure SQL para conexões criptografadas
        encrypt: true,
        // Permite certificados autoassinados em ambientes de homologação
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
      },
      logging: false,
    };
  }

  // ────────────────────────────────────────────
  // DESENVOLVIMENTO: SQLite (arquivo local)
  // ────────────────────────────────────────────
  return {
    type: 'better-sqlite3',
    database: process.env.DB_PATH || 'livraria-dev.db',
    entities: [Livro],
    // synchronize: true em desenvolvimento sincroniza o esquema
    // automaticamente sempre que a entidade mudar.
    synchronize: true,
    logging: true,
  };
});
