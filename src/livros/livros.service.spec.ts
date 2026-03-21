import { Test } from '@nestjs/testing';
import { INestApplicationContext } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LivrosService } from './livros.service';
import { Livro } from './entities/livro.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

/**
 * TESTES UNITÁRIOS do LivrosService
 *
 * Testes unitários verificam uma unidade isolada de código (o Service),
 * sem depender de banco de dados real, HTTP ou outros serviços externos.
 *
 * Estratégia: criamos um "mock" (simulação) do Repository do TypeORM
 * para controlar os dados retornados em cada cenário de teste.
 */
describe('LivrosService', () => {
  let service: LivrosService;
  let repositorioMock: jest.Mocked<Partial<Repository<Livro>>>;
  // Dados de exemplo reutilizados nos testes
  const livroExemplo: Livro = {
    id: 1,
    codigo: 'BK-2025-1234',
    titulo: 'O Hobbit',
    autor: 'J.R.R. Tolkien',
    descricao: 'Uma aventura inesperada.',
    ano: 1937,
    paginas: 310,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  beforeEach(async () => {
    // Cria um mock do Repository com as funções que o Service usa
    repositorioMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const modulo = await Test.createTestingModule({
      providers: [
        LivrosService,
        {
          // Diz ao NestJS: quando alguém pedir o Repository<Livro>,
          // entregue nosso mock ao invés de conectar ao banco real.
          provide: getRepositoryToken(Livro),
          useValue: repositorioMock,
        },
      ],
    }).compile();

    // O cast para INestApplicationContext é necessário porque TypeScript não
    // resolve automaticamente o método .get() herdado de NestApplicationContext
    service = (modulo as unknown as INestApplicationContext).get(LivrosService);
  });

  // ── listarTodos ────────────────────────────────────────────────────────────

  describe('listarTodos', () => {
    it('deve retornar todos os livros quando não há busca', async () => {
      (repositorioMock.find as jest.Mock).mockResolvedValue([livroExemplo]);

      const resultado = await service.listarTodos();

      expect(resultado).toEqual([livroExemplo]);
      expect(repositorioMock.find).toHaveBeenCalledTimes(1);
    });
  });

  // ── buscarPorCodigo ────────────────────────────────────────────────────────

  describe('buscarPorCodigo', () => {
    it('deve retornar o livro quando o código existe', async () => {
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(livroExemplo);

      const resultado = await service.buscarPorCodigo('BK-2025-1234');
      expect(resultado).toEqual(livroExemplo);
    });

    it('deve lançar NotFoundException quando o código não existe', async () => {
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.buscarPorCodigo('BK-9999-0000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── criar ──────────────────────────────────────────────────────────────────

  describe('criar', () => {
    const dto = {
      codigo: 'BK-2025-9999',
      titulo: 'Novo Livro',
      autor: 'Autor Teste',
      ano: 2024,
      paginas: 200,
    };

    it('deve criar e retornar o livro quando o código é único', async () => {
      // Simula: nenhum livro com este código existe ainda
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(null);
      (repositorioMock.create as jest.Mock).mockReturnValue({ ...dto, id: 2 });
      (repositorioMock.save as jest.Mock).mockResolvedValue({ ...dto, id: 2 });

      const resultado = await service.criar(dto);
      expect(resultado.codigo).toBe('BK-2025-9999');
    });

    it('deve lançar ConflictException quando o código já existe', async () => {
      // Simula: já existe um livro com este código
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(livroExemplo);

      await expect(service.criar({ ...dto, codigo: 'BK-2025-1234' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ── remover ────────────────────────────────────────────────────────────────

  describe('remover', () => {
    it('deve remover o livro sem erros', async () => {
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(livroExemplo);
      (repositorioMock.remove as jest.Mock).mockResolvedValue(livroExemplo);

      await expect(service.remover('BK-2025-1234')).resolves.not.toThrow();
    });

    it('deve lançar NotFoundException ao remover código inexistente', async () => {
      (repositorioMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remover('BK-9999-0000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
