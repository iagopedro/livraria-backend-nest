# ──────────────────────────────────────────────────────────────────────────────
# Dockerfile — Build em múltiplos estágios (multi-stage build)
#
# Estágio 1 (builder): instala dependências e compila o TypeScript para JS.
# Estágio 2 (runner):  copia apenas os artefatos compilados.
#
# Resultado: imagem final leve (~200MB vs ~600MB com devDependencies).
# A Azure Container Apps e o Azure App Service (Linux) suportam este formato.
# ──────────────────────────────────────────────────────────────────────────────

# ── ESTÁGIO 1: BUILD ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro.
# Isso aproveita o cache de camadas do Docker: se package.json não mudar,
# o "npm ci" não será re-executado em builds subsequentes.
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# npm ci instala exatamente o que está no package-lock.json (mais seguro que npm install)
RUN npm ci

# Copia o restante do código-fonte
COPY src/ ./src/

# Compila TypeScript → JavaScript (gera a pasta /app/dist)
RUN npm run build

# Remove devDependencies para reduzir o tamanho do artefato
RUN npm prune --production

# ── ESTÁGIO 2: RUNNER (imagem final) ─────────────────────────────────────────
FROM node:20-alpine AS runner

# Variáveis de ambiente padrão do container
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Cria um usuário não-root por segurança (princípio do menor privilégio)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia apenas o necessário do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Define o usuário para execução
USER appuser

# Expõe a porta (documentação — a Azure lê a variável PORT em runtime)
EXPOSE 3000

# Healthcheck: a Azure usa isso para verificar se o container está saudável
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Comando de inicialização
CMD ["node", "dist/main"]
