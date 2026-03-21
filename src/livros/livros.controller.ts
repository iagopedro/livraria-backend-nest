import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { LivrosService } from './livros.service';
import { CriarLivroDto } from './dto/criar-livro.dto';
import { AtualizarLivroDto } from './dto/atualizar-livro.dto';
import { Livro } from './entities/livro.entity';

/**
 * CONTROLLER (Controlador) no NestJS:
 *
 * O Controller é responsável por receber requisições HTTP e devolver
 * respostas. Ele NÃO contém lógica de negócio — delega tudo ao Service.
 *
 * Analogia: o Controller é o garçom de um restaurante. Ele recebe
 * o pedido do cliente (requisição HTTP) e passa para a cozinha (Service).
 *
 * @Controller('livros') → define o prefixo de rota: /livros
 * @ApiTags('Livros')    → agrupa os endpoints na documentação Swagger
 */
@ApiTags('Livros')
@Controller('livros')
export class LivrosController {

  /**
   * Injeção de Dependência:
   * O NestJS injeta automaticamente a instância do LivrosService.
   * O modificador "private readonly" garante que o serviço não seja
   * substituído acidentalmente dentro deste controller.
   */
  constructor(private readonly livrosService: LivrosService) {}

  // ----------------------------------------------------------------
  // GET /livros
  // GET /livros?busca=tolkien
  // ----------------------------------------------------------------

  /**
   * @ApiOperation: descreve o endpoint na documentação interativa.
   * @ApiResponse: documenta os possíveis códigos de retorno HTTP.
   * @ApiQuery:    declara parâmetros de query opcionais no Swagger.
   */
  @ApiOperation({ summary: 'Lista todos os livros com busca opcional' })
  @ApiQuery({
    name: 'busca',
    required: false,
    description: 'Filtra por título ou autor (case-insensitive)',
  })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.', type: [Livro] })
  @Get()
  listarTodos(@Query('busca') busca?: string): Promise<Livro[]> {
    return this.livrosService.listarTodos(busca);
  }

  // ----------------------------------------------------------------
  // GET /livros/gerar-codigo
  // ----------------------------------------------------------------

  @ApiOperation({ summary: 'Gera um código único para um novo livro' })
  @ApiResponse({ status: 200, description: 'Código gerado com sucesso.' })
  @Get('gerar-codigo')
  async gerarCodigo(): Promise<{ codigo: string }> {
    const codigo = await this.livrosService.gerarCodigo();
    return { codigo };
  }

  // ----------------------------------------------------------------
  // GET /livros/:codigo
  // ----------------------------------------------------------------

  @ApiOperation({ summary: 'Retorna um livro pelo código' })
  @ApiParam({ name: 'codigo', description: 'Código do livro (BK-AAAA-XXXX)' })
  @ApiResponse({ status: 200, description: 'Livro encontrado.', type: Livro })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  @Get(':codigo')
  buscarPorCodigo(@Param('codigo') codigo: string): Promise<Livro> {
    return this.livrosService.buscarPorCodigo(codigo);
  }

  // ----------------------------------------------------------------
  // POST /livros
  // ----------------------------------------------------------------

  /**
   * @Body() extrai e valida automaticamente o corpo da requisição.
   * O ValidationPipe (configurado em main.ts) rejeita a requisição
   * antes mesmo de chegar aqui se os dados não passarem nas regras do DTO.
   */
  @ApiOperation({ summary: 'Cadastra um novo livro' })
  @ApiResponse({ status: 201, description: 'Livro criado com sucesso.', type: Livro })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Código já existe.' })
  @Post()
  criar(@Body() dto: CriarLivroDto): Promise<Livro> {
    return this.livrosService.criar(dto);
  }

  // ----------------------------------------------------------------
  // PATCH /livros/:codigo
  // ----------------------------------------------------------------

  /**
   * PATCH vs PUT:
   * PUT substitui o recurso inteiro (todos os campos obrigatórios).
   * PATCH atualiza parcialmente (apenas os campos enviados).
   * Preferimos PATCH pois o frontend pode querer editar só o título.
   */
  @ApiOperation({ summary: 'Atualiza parcialmente um livro' })
  @ApiParam({ name: 'codigo', description: 'Código do livro (BK-AAAA-XXXX)' })
  @ApiResponse({ status: 200, description: 'Livro atualizado.', type: Livro })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  @Patch(':codigo')
  atualizar(
    @Param('codigo') codigo: string,
    @Body() dto: AtualizarLivroDto,
  ): Promise<Livro> {
    return this.livrosService.atualizar(codigo, dto);
  }

  // ----------------------------------------------------------------
  // DELETE /livros/:codigo
  // ----------------------------------------------------------------

  /**
   * @HttpCode(HttpStatus.NO_CONTENT):
   * Por convenção REST, uma deleção bem-sucedida retorna HTTP 204
   * (sem corpo na resposta). O decorator sobrescreve o padrão 200.
   */
  @ApiOperation({ summary: 'Remove um livro pelo código' })
  @ApiParam({ name: 'codigo', description: 'Código do livro (BK-AAAA-XXXX)' })
  @ApiResponse({ status: 204, description: 'Livro removido.' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':codigo')
  remover(@Param('codigo') codigo: string): Promise<void> {
    return this.livrosService.remover(codigo);
  }
}
