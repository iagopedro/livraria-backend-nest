# Livraria Backend

API REST construída com **NestJS**, **TypeORM** e **SQLite** (desenvolvimento) / **Azure SQL** (produção).

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação e execução local

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Iniciar em modo desenvolvimento (hot-reload)
npm run start:dev
```

Servidor disponível em: `http://localhost:3000/api`  
Documentação Swagger: `http://localhost:3000/api/docs`

## Endpoints

| Método | Rota                       | Descrição                              |
|--------|----------------------------|----------------------------------------|
| GET    | /api/livros                | Lista todos os livros                  |
| GET    | /api/livros?busca=tolkien  | Busca por título ou autor              |
| GET    | /api/livros/gerar-codigo   | Gera um código único BK-AAAA-XXXX      |
| GET    | /api/livros/:codigo        | Retorna um livro pelo código           |
| POST   | /api/livros                | Cadastra um novo livro                 |
| PATCH  | /api/livros/:codigo        | Atualiza parcialmente um livro         |
| DELETE | /api/livros/:codigo        | Remove um livro                        |
| GET    | /api/health                | Health check do servidor               |

## Integração com o Frontend Angular

No `LivroService` do Angular, substitua as chamadas ao `localStorage` por chamadas HTTP:

```typescript
// src/app/core/services/livro.ts (Angular)
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:3000/api';

// Listar todos
this.http.get<Livro[]>(`${API_URL}/livros`)

// Criar
this.http.post<Livro>(`${API_URL}/livros`, livro)

// Remover
this.http.delete(`${API_URL}/livros/${codigo}`)

// Gerar código
this.http.get<{ codigo: string }>(`${API_URL}/livros/gerar-codigo`)
```

## Testes

```bash
npm test            # executa os testes unitários
npm run test:cov    # com cobertura de código
```

## Estrutura do projeto

```
src/
├── main.ts                    # Ponto de entrada, configuração global
├── app.module.ts              # Módulo raiz
├── config/
│   ├── database.config.ts     # Configuração do banco por ambiente
│   └── data-source.ts         # DataSource para migrations (CLI)
├── health/
│   └── health.controller.ts   # GET /api/health
├── livros/
│   ├── livros.module.ts       # Módulo de livros
│   ├── livros.controller.ts   # Rotas HTTP
│   ├── livros.service.ts      # Lógica de negócio
│   ├── livros.service.spec.ts # Testes unitários
│   ├── dto/
│   │   ├── criar-livro.dto.ts    # Validação de entrada (POST)
│   │   └── atualizar-livro.dto.ts # Validação de entrada (PATCH)
│   └── entities/
│       └── livro.entity.ts    # Mapeamento da tabela SQL
└── migrations/
    └── 1710000000000-CriarTabelaLivros.ts
```

## Deploy na Azure

### Opção A — Azure App Service (Container)

1. Crie um **Azure Container Registry (ACR)**
2. Faça o build e push da imagem:
   ```bash
   docker build -t seu-acr.azurecr.io/livraria-backend:latest .
   docker push seu-acr.azurecr.io/livraria-backend:latest
   ```
3. Crie um **Azure App Service** (Linux, container)
4. Nas **Configurações de Aplicativo** (Application Settings), adicione:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `seu-servidor.database.windows.net`
   - `DB_PORT` = `1433`
   - `DB_NAME` = `livraria`
   - `DB_USERNAME` = `seu_usuario`
   - `DB_PASSWORD` = `sua_senha` (use Azure Key Vault Reference)
   - `CORS_ORIGINS` = `https://sua-app.azurestaticapps.net`

### Opção B — CI/CD com Azure DevOps

Configure o arquivo `azure-pipelines.yml` com:
- `acrName`: nome do seu Container Registry
- `AzureContainerRegistry`: nome da Service Connection ao ACR
- `AzureServiceConnection`: nome da Service Connection à subscription
- `appName`: nome do App Service

### Banco de dados em produção

1. Crie um **Azure SQL Database**
2. Execute as migrations antes do primeiro deploy:
   ```bash
   # Com as variáveis de produção configuradas no .env
   npm run migration:run
   ```

## Variáveis de ambiente

| Variável          | Padrão           | Descrição                              |
|-------------------|------------------|----------------------------------------|
| `NODE_ENV`        | `development`    | Ambiente (development/production/test) |
| `PORT`            | `3000`           | Porta HTTP                             |
| `DB_PATH`         | `livraria-dev.db`| Caminho do SQLite (desenvolvimento)    |
| `DB_HOST`         | —                | Host do Azure SQL (produção)           |
| `DB_PORT`         | `1433`           | Porta do SQL Server                    |
| `DB_NAME`         | —                | Nome do banco                          |
| `DB_USERNAME`     | —                | Usuário do banco                       |
| `DB_PASSWORD`     | —                | Senha do banco                         |
| `DB_TRUST_CERT`   | `false`          | Confiar em certificado autoassinado    |
| `CORS_ORIGINS`    | `http://localhost:4200` | Origens CORS permitidas (vírgula)  |
