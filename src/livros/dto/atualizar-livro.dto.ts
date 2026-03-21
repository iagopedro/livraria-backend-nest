import { PartialType } from '@nestjs/swagger';
import { CriarLivroDto } from './criar-livro.dto';

/**
 * DTO para atualização parcial (PATCH).
 *
 * PartialType(CriarLivroDto) cria automaticamente uma nova classe
 * onde TODOS os campos de CriarLivroDto se tornam opcionais (@IsOptional).
 * Isso evita duplicação de código: não é necessário redefinir cada campo.
 *
 * Exemplo de uso (PATCH /livros/BK-2025-4321):
 * { "titulo": "Novo Título" }  → atualiza apenas o título
 */
export class AtualizarLivroDto extends PartialType(CriarLivroDto) {}
