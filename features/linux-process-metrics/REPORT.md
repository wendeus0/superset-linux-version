# REPORT — linux-process-metrics

**Feature:** P0-002 `@superset/linux-process-metrics`
**Date:** 2026-03-26
**Status:** READY_FOR_COMMIT

---

## Deliverables

| Artefato | Caminho | Status |
|---|---|---|
| Implementação | `packages/linux-process-metrics/src/index.ts` | ✓ |
| Tipos públicos | `packages/linux-process-metrics/index.d.ts` | ✓ |
| Testes (5/5) | `packages/linux-process-metrics/test/index.test.ts` | ✓ |
| Package config | `packages/linux-process-metrics/package.json` | ✓ |
| Integração desktop | `apps/desktop/src/main/lib/resource-metrics/process-tree.ts` | ✓ |
| Integração desktop | `apps/desktop/src/main/lib/resource-metrics/index.ts` | ✓ |
| Dependência | `apps/desktop/package.json` | ✓ |
| ADR | `docs/adr/008-linux-process-memory-metric-pss.md` | ✓ |

---

## Critérios de aceite (SPEC-002)

| # | Critério | Evidência |
|---|---|---|
| AC-1 | Retorna PSS em bytes para PID acessível | teste `deve retornar PSS em bytes para PID com smaps_rollup válido` ✓ |
| AC-2 | Omite PID com EACCES sem lançar | teste `deve omitir PID inacessível (EACCES)` ✓ |
| AC-3 | Omite PID com ENOENT sem lançar | teste `deve omitir PID não encontrado (ENOENT)` ✓ |
| AC-4 | Array vazio retorna `{}` | teste `deve retornar {} para array vazio` ✓ |
| AC-5 | Não-Linux retorna `{}` | guarda `process.platform !== "linux"` em `src/index.ts:6` ✓ |
| AC-6 | Integração com process-tree | `enrichWithLinuxFootprint` chamada em `index.ts:293` ✓ |
| AC-7 | `tsc --noEmit` limpo | executado — 0 erros ✓ |
| AC-8 | Múltiplos PIDs — parcial | teste `deve processar múltiplos PIDs retornando apenas os acessíveis` ✓ |

---

## Quality gate

- Typecheck pacote: `PASS` (0 erros)
- Typecheck desktop: `PASS` (0 erros)
- Testes: 5/5 verdes

---

## Security review

Não aplicável: sem CI/CD alterado, sem auth/secrets, sem APIs públicas, sem inputs externos de usuário (PIDs vêm de snapshot interno do processo).

---

## Riscos residuais

| Risco | Mitigação |
|---|---|
| Kernel < 4.14 sem `smaps_rollup` | PIDs omitidos silenciosamente; RSS do snapshot `ps` é mantido |
| EPERM em ambientes containerizados restritos | Mesmo tratamento de EACCES/ENOENT — omissão silenciosa |
| `main: "src/index.ts"` expõe fonte TypeScript | Aceitável — consumido exclusivamente via electron-vite que transpila workspace packages |
