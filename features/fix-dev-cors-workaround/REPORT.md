# REPORT: fix-dev-cors-workaround

## Objetivo

Corrigir CORS wildcard implícito no `host-service` local do desktop, substituindo `cors()` sem parâmetros por allowlist restrita a localhost. Adicionar guardrail documental em `CORS_EXTRA_ORIGINS`.

## Escopo alterado

| Arquivo | Tipo | Mudança |
|---------|------|---------|
| `packages/host-service/src/cors.ts` | novo | `buildLocalhostCors(port)` — allowlist: localhost:PORT, 127.0.0.1:PORT, "null" |
| `packages/host-service/src/app.ts` | modificado | `cors()` → `buildLocalhostCors(rendererPort)` |
| `packages/host-service/test/cors.test.ts` | novo | 5 testes unitários cobrindo localhost, 127.0.0.1, null origin, origem externa, porta errada |
| `apps/api/src/env.ts` | modificado | comentário de guardrail em `CORS_EXTRA_ORIGINS` (sem mudança de comportamento) |

## Validações executadas

- **code-review**: `REVIEW_OK_WITH_NOTES` — melhoria aplicada (teste para `"null"` origin adicionado durante o ciclo)
- **quality-gate**: `QUALITY_PASS`
  - `tsc --noEmit` (host-service): sem erros
  - `bun test` (cors.test.ts): 5/5 pass
  - `biome check` (4 arquivos): sem achados
- **security-review**: `EXECUTED — SECURITY_PASS_WITH_NOTES` (ver riscos residuais)

## Critérios de aceite — status

| Critério | Status |
|---------|--------|
| host-service reflete ACAO apenas para localhost:PORT e 127.0.0.1:PORT | ✓ |
| host-service rejeita origens externas | ✓ |
| CORS_EXTRA_ORIGINS com comentário de guardrail | ✓ |
| bun run typecheck verde | ✓ |
| biome check verde | ✓ |

## Riscos residuais

1. **`"null"` origin** — intencional para Electron prod (`loadFile` via `file://` → Chromium envia `Origin: null`). Risco residual aceito: vetor de abuso pressupõe execução local com acesso ao filesystem.
2. ~~**`CORS_EXTRA_ORIGINS` sem guard de `NODE_ENV` em `proxy.ts`**~~ — resolvido em `fix/review-corrections`: `extraOrigins` agora só é aplicado quando `NODE_ENV !== "production"`.
3. **Binding do host-service** — não verificado se listener usa `127.0.0.1` ou `0.0.0.0`. Se `0.0.0.0`, origens na LAN podem alcançar o serviço diretamente (CORS não protege contra conexões não-browser). Follow-up recomendado.

## Follow-ups

- [ ] Verificar binding do host-service (`127.0.0.1` vs `0.0.0.0`)
- [x] Adicionar guard `NODE_ENV !== "production"` em `proxy.ts` para `CORS_EXTRA_ORIGINS` — implementado em `fix/review-corrections`

---

**READY_FOR_COMMIT**
