# CONTEXT.md — superset-linux-version

Estado operacional da sessão e da fase ativa do fork.

## Estado atual

| Campo | Valor |
|---|---|
| Objetivo principal | Portar e oficializar suporte Linux para Superset Desktop |
| Repositório base | Fork de `superset-sh/superset` |
| Foco de plataforma | Arch Linux (rolling) + Ubuntu 22.04/24.04 |
| Distribuição alvo | AppImage + `.deb` + AUR (`superset-bin`) |
| Branch sugerida | `feat/linux-port-arch-ubuntu` |

## Fase ativa

**M6 concluída (2026-03-26).** Frente de otimização de memória completa (Fases 1–3).

Resumo das três fases:
- **Fase 1**: WebView idle unloading, terminal scrollback cap, terminal idle session culling, React Query cache limits.
- **Fase 2**: MediaQuery memory leak fix, chat polling split (display vs. messages), memory pressure UI (Force Cleanup), DevTools lazy-load.
- **Fase 3**: Chat message display cap (100 msgs + "Load earlier"), terminal per-session RSS limit (512 MB via process-tree sweep).

Próximas frentes candidatas:
- **3.2** (deferred): Chat virtualization com `@tanstack/react-virtual` para listas muito longas.
- `fix/dev-cors-workaround` — isolar e avaliar merge das mudanças CORS de desenvolvimento.
- Contribuição de patches locais de volta ao upstream (`superset-sh/superset`).
- Automação AUR com credenciais reais (fora do escopo M5/M6; requer avaliação separada).

## Backlog macro

| Fase | Título | Status |
|---|---|---|
| M0 | Baseline e critérios de aceite Linux | ✅ |
| M1 | CI Linux com smoke test | ✅ |
| M2 | Hardening de runtime nativo | ✅ |
| M3 | Distribuição (`.deb` + AUR) | ✅ |
| M4 | UX Linux + documentação final | ✅ |
| M5 | Go-live controlado | ✅ |
| M6 | Otimização de memória (Fases 1–3) | ✅ |

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
