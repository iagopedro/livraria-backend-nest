import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * ENTIDADE (Entity) no TypeORM:
 * Uma classe decorada com @Entity() representa uma tabela no banco de dados.
 * Cada instância desta classe corresponde a uma linha da tabela.
 *
 * O TypeORM usa os decoradores para inferir o esquema SQL automaticamente,
 * dispensando a escrita manual de CREATE TABLE.
 */
@Entity({ name: 'livros' }) // ← nome da tabela no banco de dados
export class Livro {

  /**
   * @PrimaryGeneratedColumn('increment'):
   * Cria uma coluna "id" inteira, auto-incremental (1, 2, 3...).
   * Esta é a chave primária interna do banco — o frontend utiliza
   * o campo "codigo" (BK-AAAA-XXXX) como identificador amigável.
   */
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * @Column({ unique: true }):
   * Cria uma coluna com restrição de unicidade (UNIQUE).
   * Impede que dois livros tenham o mesmo código.
   * Formato gerado pelo serviço: BK-AAAA-XXXX (ex.: BK-2025-4321)
   */
  @Column({ unique: true, length: 20 })
  codigo: string;

  /**
   * Título do livro.
   * length: 255 → limita o tamanho no banco para economizar espaço.
   */
  @Column({ length: 255 })
  titulo: string;

  /**
   * Nome do autor.
   */
  @Column({ length: 255 })
  autor: string;

  /**
   * Sinopse do livro.
   * nullable: true → o campo é opcional (pode ser NULL no banco).
   * type: 'text' → armazena textos longos sem limite definido.
   */
  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  /**
   * Ano de publicação.
   * type: 'int' → número inteiro de 4 bytes no SQL.
   */
  @Column({ type: 'int' })
  ano: number;

  /**
   * Número de páginas.
   */
  @Column({ type: 'int' })
  paginas: number;

  /**
   * @CreateDateColumn:
   * Preenchida automaticamente pelo TypeORM no momento da INSERT.
   * Útil para auditoria e ordenação cronológica.
   */
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  /**
   * @UpdateDateColumn:
   * Atualizada automaticamente a cada UPDATE.
   * Permite saber quando o registro foi modificado pela última vez.
   */
  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;
}
