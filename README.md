# random-api

API Node.js com Express para receber webhooks do WhatsApp/Meta, armazenar mensagens em
SQLite e rodar em PM2.

## Requisitos

- Node.js 22+ recomendado
- npm
- PM2 para producao
- Git, se for fazer deploy via GitHub Actions

## Instalacao

```bash
npm install
```

## Execucao local

```bash
npm run dev
```

Ou em modo direto:

```bash
npm start
```

Por padrao a aplicacao sobe na porta `3000`.

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com, no minimo:

```env
PORT=3000
WEBHOOK_VERIFY_TOKEN=seu_token_de_verificacao
```

## Rotas

- `GET /webhook`
- `POST /webhook`

O `GET /webhook` responde a verificacao do webhook da Meta quando `hub.mode=subscribe` e o
token bate com `WEBHOOK_VERIFY_TOKEN`.
O `POST /webhook` recebe eventos, imprime o payload no log e extrai a primeira mensagem
quando existir.

## Banco de dados

O projeto usa SQLite em `database.sqlite` com Drizzle.

Schema principal:

- `messages`

Arquivos relevantes:

- `database/client.js`
- `database/schema.js`
- `database/messagesRepository.js`
- `drizzle.config.js`

## Scripts

```bash
npm run start        # executa a API
npm run dev          # executa com nodemon
npm run lint         # valida o codigo com ESLint
npm run lint:fix     # corrige o que for possivel
npm run format       # formata com Prettier
npm run format:check # verifica formatacao
npm run db:generate  # gera migrations do Drizzle
npm run db:migrate   # aplica migrations do Drizzle
npm run db:studio    # abre o Drizzle Studio
```

## Deploy com PM2

O processo foi configurado para rodar no PM2 usando `ecosystem.config.cjs`.

Exemplo:

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
```

## Deploy automatico via GitHub Actions

O repositorio possui um workflow em `.github/workflows/main.yml` que executa deploy a cada
push na branch `main`.

Secrets esperados no GitHub:

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY` ou `SERVER_SSH_KEY_B64`
- `SERVER_PORT` opcional

Fluxo do deploy:

1. o GitHub Actions abre SSH no servidor
2. entra em `/var/www/apps/random-api`
3. faz `git fetch` e `git reset --hard origin/main`
4. instala dependencias com `npm ci --omit=dev`
5. recarrega o processo no PM2

## Estrutura

```text
random-api/
├── .github/workflows/
├── database/
├── server.js
├── container.js
├── ecosystem.config.cjs
└── package.json
```

## Observacoes

- O projeto ainda nao tem testes automatizados.
- O banco SQLite fica no arquivo `database.sqlite`.
- O `POST /webhook` hoje registra o evento e prepara a base para logica de resposta futura.
