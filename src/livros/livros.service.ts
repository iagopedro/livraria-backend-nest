import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Livro } from './entities/livro.entity';
import { CriarLivroDto } from './dto/criar-livro.dto';
import { AtualizarLivroDto } from './dto/atualizar-livro.dto';

/**
 * SERVICE (Serviço) no NestJS:
 *
 * O Service é a camada de negócio da aplicação — é aqui onde ficam
 * as regras que dizem "o que o sistema deve fazer".
 *
 * Princípio de Responsabilidade Única (SRP — SOLID):
 * O Service sabe apenas de lógica de negócio. Ele não sabe nada
 * sobre HTTP, rotas, cabeçalhos ou respostas. Isso é trabalho do Controller.
 *
 * @Injectable() torna esta classe gerenciada pelo contêiner de DI (Injeção
 * de Dependência) do NestJS. Isso significa que o NestJS cria e gerencia
 * a instância deste serviço, injetando-a onde for necessária.
 */
@Injectable()
export class LivrosService {

  /**
   * @InjectRepository(Livro):
   * Injeta o Repository do TypeORM para a entidade Livro.
   * O Repository é o objeto que executa as queries SQL (SELECT, INSERT, etc.)
   * — ele implementa o padrão de projeto "Repository Pattern", que separa
   * a lógica de acesso a dados do restante da aplicação.
   */
  constructor(
    @InjectRepository(Livro)
    private readonly livroRepositorio: Repository<Livro>,
  ) {}

  /**
   * Lista todos os livros, com busca textual opcional.
   *
   * ILike: realiza uma busca case-insensitive (ignora maiúsculas/minúsculas).
   * No SQL gera: WHERE titulo ILIKE '%tolkien%' OR autor ILIKE '%tolkien%'
   */
  async listarTodos(busca?: string): Promise<Livro[]> {
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      return this.livroRepositorio.find({
        where: [
          { titulo: ILike(termo) },
          { autor: ILike(termo) },
        ],
        order: { criadoEm: 'DESC' },
      });
    }

    return this.livroRepositorio.find({ order: { criadoEm: 'DESC' } });
  }

  /**
   * Busca um único livro pelo código amigável (BK-AAAA-XXXX).
   *
   * NotFoundException: exceção do NestJS que resulta em HTTP 404.
   * Usar exceções do framework garante respostas de erro padronizadas.
   */
  async buscarPorCodigo(codigo: string): Promise<Livro> {
    const livro = await this.livroRepositorio.findOne({ where: { codigo } });

    if (!livro) {
      throw new NotFoundException(`Livro com código "${codigo}" não encontrado.`);
    }

    return livro;
  }

  /**
   * Cria um novo livro no banco de dados.
   *
   * Fluxo:
   * 1. Verifica se já existe um livro com o mesmo código (regra de negócio).
   * 2. Cria uma instância da entidade com os dados do DTO.
   * 3. Persiste no banco com .save().
   *
   * ConflictException → HTTP 409: indica que o recurso já existe.
   */
  async criar(dto: CriarLivroDto): Promise<Livro> {
    // Gera o código automaticamente caso o frontend não o tenha enviado
    const codigo = dto.codigo ?? (await this.gerarCodigo());

    // Verifica duplicidade apenas quando o código foi informado explicitamente
    if (dto.codigo) {
      const existente = await this.livroRepositorio.findOne({
        where: { codigo },
      });

      if (existente) {
        throw new ConflictException(
          `Já existe um livro com o código "${codigo}".`,
        );
      }
    }

    // .create() cria uma instância da entidade (sem salvar ainda)
    // .save()   persiste de fato no banco (executa o INSERT)
    const novoLivro = this.livroRepositorio.create({
      ...dto,
      codigo,
      descricao: dto.descricao ?? null,
    });

    return this.livroRepositorio.save(novoLivro);
  }

  /**
   * Atualiza parcialmente um livro existente (semântica PATCH).
   *
   * Object.assign() copia apenas os campos presentes no DTO para a
   * entidade — campos não informados permanecem com seus valores atuais.
   */
  async atualizar(codigo: string, dto: AtualizarLivroDto): Promise<Livro> {
    const livro = await this.buscarPorCodigo(codigo);

    // Impede a troca de código se um novo código já estiver em uso.
    // O cast para Partial<CriarLivroDto> é necessário porque PartialType
    // não expõe as propriedades diretamente no sistema de tipos do TypeScript.
    const dados = dto as Partial<CriarLivroDto>;

    if (dados.codigo && dados.codigo !== codigo) {
      const codigoEmUso = await this.livroRepositorio.findOne({
        where: { codigo: dados.codigo },
      });
      if (codigoEmUso) {
        throw new ConflictException(
          `Já existe um livro com o código "${dados.codigo}".`,
        );
      }
    }

    Object.assign(livro, dto);
    return this.livroRepositorio.save(livro);
  }

  /**
   * Remove um livro pelo código.
   * Retorna void — o Controller sinalizará HTTP 204 (No Content).
   */
  async remover(codigo: string): Promise<void> {
    const livro = await this.buscarPorCodigo(codigo);
    await this.livroRepositorio.remove(livro);
  }

  /**
   * Gera um código único no formato BK-AAAA-XXXX.
   * Delega ao banco a verificação de unicidade, garantindo consistência
   * mesmo em cenários de requisições simultâneas (concorrência).
   */
  async gerarCodigo(): Promise<string> {
    const ano = new Date().getFullYear();
    let codigo: string;

    // Tenta até encontrar um código que ainda não existe no banco
    do {
      const numero = Math.floor(1000 + Math.random() * 9000);
      codigo = `BK-${ano}-${numero}`;
    } while (
      await this.livroRepositorio.findOne({ where: { codigo } })
    );

    return codigo;
  }
}
