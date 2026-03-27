import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) — Objeto de Transferência de Dados
 *
 * Um DTO define exatamente quais campos são aceitos em uma requisição.
 * Ele age como um "filtro de entrada": dados que não estiverem no DTO
 * são descartados automaticamente, protegendo contra mass assignment.
 *
 * O NestJS usa a biblioteca "class-validator" para validar cada campo
 * através de decoradores. Se a validação falhar, o framework retorna
 * automaticamente HTTP 400 (Bad Request) com detalhes do erro.
 *
 * Os decoradores @ApiProperty vêm do @nestjs/swagger e geram a
 * documentação interativa da API automaticamente (Swagger UI).
 */
export class CriarLivroDto {

  /**
   * Código único no formato BK-AAAA-XXXX.
   * Campo opcional: quando não informado, o backend gera automaticamente
   * via gerarCodigo().
   */
  @ApiPropertyOptional({
    description: 'Código único no formato BK-AAAA-XXXX (gerado automaticamente se omitido)',
    example: 'BK-2026-4321',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'O código deve ter no máximo 20 caracteres.' })
  codigo?: string;

  /**
   * @MinLength(2) → mínimo de 2 caracteres (igual à validação do Angular)
   */
  @ApiProperty({
    description: 'Título do livro',
    example: 'O Senhor dos Anéis',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MinLength(2, { message: 'O título deve ter no mínimo 2 caracteres.' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
  titulo: string;

  @ApiProperty({
    description: 'Nome do autor',
    example: 'J.R.R. Tolkien',
  })
  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  @MaxLength(255, { message: 'O autor deve ter no máximo 255 caracteres.' })
  autor: string;

  /**
   * @IsOptional() → o campo pode estar ausente na requisição.
   * Se não enviado, será null no banco.
   */
  @ApiPropertyOptional({
    description: 'Sinopse do livro (opcional)',
    example: 'Uma história épica de fantasia...',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres.' })
  descricao?: string;

  /**
   * @IsInt() → deve ser um número inteiro (sem decimais)
   * @Min(1450) → pois a imprensa de Gutenberg é de ~1450
   */
  @ApiProperty({
    description: 'Ano de publicação',
    example: 1954,
    minimum: 1450,
  })
  @IsInt({ message: 'O ano deve ser um número inteiro.' })
  @Min(1450, { message: 'O ano mínimo é 1450.' })
  @Max(new Date().getFullYear(), { message: `O ano não pode ser futuro.` })
  ano: number;

  @ApiProperty({
    description: 'Número de páginas',
    example: 1178,
    minimum: 1,
  })
  @IsInt({ message: 'O número de páginas deve ser um inteiro.' })
  @Min(1, { message: 'O livro deve ter ao menos 1 página.' })
  paginas: number;
}
