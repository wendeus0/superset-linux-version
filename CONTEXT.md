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

1. Tornar o build Linux reproduzível com gate de CI.
2. Endurecer runtime nativo (`@parcel/watcher`, `libsql`, `ast-grep`).
3. Consolidar distribuição para Ubuntu e Arch.
4. Fechar documentação de arquitetura, instalação e troubleshooting.

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
- Manifesto de update Linux é gerado e publicado.
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
