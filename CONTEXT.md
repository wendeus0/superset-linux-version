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

1. Consolidar distribuição Linux oficial com AppImage + `.deb`.
2. Instituir smoke gate Linux obrigatório em CI e no pipeline de release.
3. Estruturar base AUR (`superset-bin`) com scripts de bump/checksum/validação.
4. Fechar documentação operacional (SPEC/ADR/RELEASE) e riscos residuais.

## Backlog macro

| Fase | Título | Dependência |
|---|---|---|
| M0 | Baseline e critérios de aceite Linux | — |
| M1 | CI Linux com smoke test | M0 |
| M2 | Hardening de runtime nativo | M1 |
| M3 | Distribuição (`.deb` + AUR) | M2 |
| M4 | UX Linux + documentação final | M3 |
| M5 | Go-live controlado | M4 |

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

## Governança operacional

- Uma feature por vez.
- Não misturar escopo.
- Mudança arquitetural durável exige ADR.
- Atualizar este arquivo ao final de cada macrofase.
