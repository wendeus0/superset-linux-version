# ADR 007 — Política de distribuição Linux oficial com smoke gate obrigatório

## Status
Accepted

## Contexto

O fork `superset-linux-version` precisa consolidar Linux como plataforma de primeira classe sem depender apenas de AppImage e sem release sem validação mínima de runtime.

Até aqui, o pipeline já gera AppImage e manifesto Linux, mas ainda há lacunas para:
- distribuição oficial Ubuntu via `.deb`;
- gate de smoke Linux explícito antes de publicar release;
- trilha operacional para ecossistema Arch (AUR `superset-bin`).

Como a política de build/release impacta contratos operacionais duráveis do projeto, a decisão exige ADR.

## Decisão

Adotar política oficial de distribuição Linux baseada em três pilares:

1) Artefatos oficiais Linux
- AppImage (canal universal)
- `.deb` (canal Ubuntu oficial)
- manifesto de update Linux estável para updater

2) Gate obrigatório de qualidade Linux
- smoke gate Linux em CI como pré-condição para release desktop
- falha do gate bloqueia publicação

3) Base de automação AUR
- manter no repositório template e scripts de bump/checksum/validação
- publicação no AUR permanece etapa controlada (sem automação com credenciais nesta fase)

## Consequências

Positivas
- reduz risco de release quebrado para Linux;
- melhora previsibilidade para Ubuntu e Arch;
- cria trilha auditável para manutenção de distribuição Linux.

Trade-offs
- aumento do tempo de CI para incluir smoke gate;
- aumento de complexidade do pipeline de release;
- necessidade contínua de manutenção dos scripts AUR.

Riscos residuais
- variação de comportamento entre distros fora do alvo oficial;
- necessidade de acompanhar mudanças no upstream em workflows.

## Referências

- `docs/architecture/specs/001-linux-distribution-smoke-gate.md`
- `CONTEXT.md`
- `apps/desktop/RELEASE.md`
- `.github/workflows/build-desktop.yml`
- `.github/workflows/release-desktop.yml`
- `.github/workflows/release-desktop-canary.yml`
