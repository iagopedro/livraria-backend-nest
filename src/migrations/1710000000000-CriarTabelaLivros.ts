import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * MIGRATION — Controle de versão do banco de dados
 *
 * Migrations registram em código cada alteração estrutural no banco
 * (CREATE TABLE, ALTER COLUMN, DROP INDEX etc.), assim como o Git
 * registra mudanças no código-fonte.
 *
 * Benefícios:
 * - Todas as mudanças são rastreáveis e reversíveis
 * - Todos no time aplicam exatamente o mesmo esquema
 * - Em produção, nunca use synchronize:true — use migrations
 *
 * Para gerar uma nova migration automaticamente:
 *   npx typeorm migration:generate src/migrations/NomeDaMigration -d src/config/data-source.ts
 */
export class CriarTabelaLivros1710000000000 implements MigrationInterface {

  /**
   * up(): aplicado ao executar "npm run migration:run"
   * Define o que deve ser CRIADO/ALTERADO no banco.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'livros',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'codigo',
            type: 'nvarchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'titulo',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'autor',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'nvarchar',
            length: 'max',  // TEXT equivalente no SQL Server
            isNullable: true,
          },
          {
            name: 'ano',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'paginas',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'criado_em',
            type: 'datetime2',
            default: 'GETDATE()',
          },
          {
            name: 'atualizado_em',
            type: 'datetime2',
            default: 'GETDATE()',
          },
        ],
        // Índice para acelerar buscas por título e autor
        indices: [
          {
            name: 'IDX_LIVROS_TITULO',
            columnNames: ['titulo'],
          },
          {
            name: 'IDX_LIVROS_AUTOR',
            columnNames: ['autor'],
          },
        ],
      }),
      true, // ifNotExists: true → não falha se a tabela já existir
    );
  }

  /**
   * down(): aplicado ao executar "npm run migration:revert"
   * Define o que deve ser DESFEITO (operação inversa de up()).
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('livros');
  }
}
