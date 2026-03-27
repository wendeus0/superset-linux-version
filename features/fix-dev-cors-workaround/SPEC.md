# SPEC: 001-fix-dev-cors-workaround

## 1. Objetivo

Corrigir dois workarounds CORS presentes no código que violam least privilege ou carecem de guardrail documentado:

1. `packages/host-service/src/app.ts` usa `cors()` sem parâmetros (wildcard implícito `*`), expondo o servidor local do desktop a qualquer origem.
2. `apps/api/src/env.ts` expõe `CORS_EXTRA_ORIGINS` como env var opcional sem documentação de risco — pode injetar origens arbitrárias em produção se configurada erroneamente.

## 2. Escopo

### Em escopo
- Restringir o CORS do `host-service` a origens localhost (porta dinâmica configurável via env var)
- Adicionar comentário inline de guardrail em `CORS_EXTRA_ORIGINS` deixando explícito que é exclusiva para desenvolvimento local
- Adicionar teste unitário para a lógica de CORS do `host-service`

### Fora de escopo
- Alterar CORS do `electric-proxy` (Cloudflare Worker com wildcard intencional para proxy público)
- Alterar CORS do servidor de notificações (`notifications/server.ts`) — servidor local com acesso controlado pelo OS
- Alterar `desktopDevOrigins` em `proxy.ts` — já isolado por `NODE_ENV`
- Alterar comportamento de `CORS_EXTRA_ORIGINS` em runtime — apenas documentação/guardrail

## 3. Critérios de aceite

- [ ] `host-service` retorna `Access-Control-Allow-Origin` apenas para origens `http://localhost:<PORT>` e `http://127.0.0.1:<PORT>` onde `PORT` é configurável (default: porta do renderer Electron)
- [ ] `host-service` rejeita (não reflete) origens externas em ambiente de testes
- [ ] `CORS_EXTRA_ORIGINS` em `env.ts` possui comentário inline indicando uso exclusivo em dev local, com aviso de risco de produção
- [ ] `bun run typecheck` verde nos pacotes afetados
- [ ] `bun run lint` verde nos arquivos modificados

## 4. Plano técnico

### Arquivos/diretórios candidatos
- `packages/host-service/src/app.ts` — substituir `cors()` por `cors({ origin: allowedOrigins })`
- `apps/api/src/env.ts` — adicionar comentário de guardrail em `CORS_EXTRA_ORIGINS`
- `packages/host-service/src/app.test.ts` (novo) — teste unitário de CORS

### Estratégia de implementação
1. Definir lista de origens permitidas no `host-service` baseada em porta configurável (`HOST_SERVICE_ALLOWED_ORIGIN` ou valor hardcoded localhost)
2. Passar lista para `cors({ origin: [...] })` do Hono
3. Adicionar comentário de guardrail em `env.ts`

### Estratégia de testes
- Unitário: `host-service` — requisição de origem proibida recebe CORS vazio; requisição localhost reflete a origem correta
- Typecheck: `bun run typecheck` nos pacotes afetados

## 5. Riscos e mitigação

- **Quebrar dev local do desktop** se a porta do renderer mudar → a porta deve ser configurável via env var com fallback para o valor padrão atual
- **Regressão em CI** se o teste precisar de porta específica → usar porta mockada no teste unitário

## 6. Evidências esperadas

- Comandos:
  - `bun run typecheck` (packages/host-service + apps/api)
  - `bun run lint` (arquivos modificados)
  - `bun run test` em `packages/host-service` (se suportado)
- Artefatos:
  - Output de typecheck e lint verde
  - Output do teste unitário com CORS rejeitando origem externa

## 7. ADR relacionado

- [ ] Não aplica — mudança localizada, sem impacto arquitetural durável
