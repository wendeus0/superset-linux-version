# CONTEXT.md — superset-linux-version

Estado operacional da sessão e da fase ativa do fork.

## Estado atual

| Campo | Valor |
|---|---|
| Objetivo principal | Portar e oficializar suporte Linux para Superset Desktop |
| Repositório base | Fork de `superset-sh/superset` |
| Foco de plataforma | Arch Linux (rolling) + Ubuntu 22.04/24.04 |
| Distribuição alvo | AppImage + `.deb` + AUR (`superset-bin`) |
| Branch ativa | `claude/optimize-system-performance-phase2-ZsxeP` |

## Fase ativa

**Frente: Otimização de Memória — Fase 2 (iniciada 2026-03-26)**

Fase 1 concluída e mergeada em 2026-03-26. Reduções implementadas:
- WebView Idle Unloading (30min timeout, sweep de 5min)
- Terminal Scrollback Hard Cap (10K linhas via MAX_TERMINAL_SCROLLBACK)
- Terminal Idle Session Culling (1h timeout, sweep de 10min)
- React Query Cache Optimization (staleTime 30s, invalidação ao trocar workspace)

Fase 2 em andamento — médio prazo (~2–4 semanas):
- **2.1** Chat History Pagination — carregar 50 mensagens recentes, lazy via IndexedDB
- **2.2** Memory Pressure Response — GC on threshold, auto-unload, "Force Cleanup" UI
- **2.3** Event Listener Audit — mapear e corrigir leaks em modais, drag, WebViews
- **2.4** Remoção de código legado — refs `chatMastra`, DevTools lazy-load, extension loader condicional

## Backlog macro

| Fase | Título | Status |
|---|---|---|
| M0 | Baseline e critérios de aceite Linux | ✅ |
| M1 | CI Linux com smoke test | ✅ |
| M2 | Hardening de runtime nativo | ✅ |
| M3 | Distribuição (`.deb` + AUR) | ✅ |
| M4 | UX Linux + documentação final | ✅ |
| M5 | Go-live controlado | ✅ |
| M6 | Otimização de memória — Fase 1 | ✅ |
| M7 | Otimização de memória — Fase 2 | 🔄 em andamento |

## Critérios de aceite Linux (resumo)

- App inicia sem crash em Ubuntu e Arch.
- Terminal integrado abre e executa comando simples.
- File watcher funciona em workspace real.
- Build Linux gera e publica AppImage + `.deb` + manifesto Linux.
- Smoke Linux passa como gate obrigatório em CI/release.
- Estratégia oficial de instalação está documentada para Ubuntu e Arch.

## Riscos e atenção

- Compatibilidade ABI e optional deps em distros diferentes.
- Regressões em runtime nativo por updates rolling no Arch.
- Drift com upstream em scripts de build/release.
- Drift com upstream em scripts de build/release — manter mudanças localizadas.

## Governança operacional

- Uma feature por vez.
- Não misturar escopo.
- Mudança arquitetural durável exige ADR.
- Atualizar este arquivo ao final de cada macrofase.
