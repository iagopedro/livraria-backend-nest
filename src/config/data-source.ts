import { DataSource } from 'typeorm';
import { Livro } from '../livros/entities/livro.entity';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente antes de tudo
dotenv.config();

/**
 * DataSource para o CLI do TypeORM (migrations).
 *
 * Este arquivo NÃO é usado pela aplicação em runtime —
 * ele é apenas para os comandos de migração:
 *
 *   npm run migration:run     → executa migrations pendentes
 *   npm run migration:revert  → desfaz a última migration
 *
 * Para gerar uma nova migration após alterar uma entidade:
 *   npx typeorm migration:generate src/migrations/NomeDaMigration -d src/config/data-source.ts
 */
export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'livraria',
  entities: [Livro],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  options: {
    encrypt: true,
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
});
