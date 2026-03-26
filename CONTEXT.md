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

**M5 concluída (2026-03-25).** Backlog macro M0–M5 completo. Linux é plataforma de primeira classe com gate de smoke obrigatório em CI.

Próximas frentes candidatas:
- `fix/dev-cors-workaround` — isolar e avaliar merge das mudanças CORS de desenvolvimento.
- Contribuição de patches locais de volta ao upstream (`superset-sh/superset`).
- Automação AUR com credenciais reais (fora do escopo M5; requer avaliação separada).

## Backlog macro

| Fase | Título | Status |
|---|---|---|
| M0 | Baseline e critérios de aceite Linux | ✅ |
| M1 | CI Linux com smoke test | ✅ |
| M2 | Hardening de runtime nativo | ✅ |
| M3 | Distribuição (`.deb` + AUR) | ✅ |
| M4 | UX Linux + documentação final | ✅ |
| M5 | Go-live controlado | ✅ |

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
