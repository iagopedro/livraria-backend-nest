import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivrosController } from './livros.controller';
import { LivrosService } from './livros.service';
import { Livro } from './entities/livro.entity';

/**
 * MÓDULO (Module) no NestJS:
 *
 * Um módulo agrupa funcionalidades relacionadas (controller, service, entidades).
 * É a unidade básica de organização do NestJS, inspirado no conceito de
 * "módulos" do Angular.
 *
 * @Module({
 *   imports:   outros módulos de que este depende
 *   controllers: classes que tratam requisições HTTP deste módulo
 *   providers:   serviços, repositórios e outras dependências injetáveis
 * })
 *
 * TypeOrmModule.forFeature([Livro]):
 * Registra o Repository da entidade Livro dentro deste módulo.
 * É o que torna possível o @InjectRepository(Livro) no LivrosService.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Livro])],
  controllers: [LivrosController],
  providers: [LivrosService],
})
export class LivrosModule {}
