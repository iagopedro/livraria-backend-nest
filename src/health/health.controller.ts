import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * HealthController — Verificação de Saúde da API
 *
 * Endpoint simples usado por:
 * - Docker HEALTHCHECK
 * - Azure App Service (liveness/readiness probe)
 * - Load balancers
 *
 * Retorna HTTP 200 quando o servidor está operacional.
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {

  @ApiOperation({ summary: 'Verifica se a API está operacional' })
  @Get()
  verificar(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
