# SDD.md — Software Design Document
# superset-linux-version (Linux First-Class Support)

Versão: 1.0
Status: Ativo

## 1. Visão geral

Este fork adapta o Superset Desktop para Linux com foco em:
- Ubuntu 22.04/24.04 (x64)
- Arch Linux rolling (x64)

Objetivo arquitetural: manter baixo desvio em relação ao upstream e fechar lacunas de build, runtime nativo e distribuição para Linux.

## 2. Objetivos de arquitetura

1. Build Linux reproduzível em CI.
2. Runtime nativo estável para dependências com bindings.
3. Distribuição oficial Linux por canais adequados ao ecossistema.
4. Governança documental e rastreabilidade por ADR.
5. Mudanças pequenas, localizadas e reversíveis.

## 3. Escopo arquitetural

### Em escopo
- Pipeline de build/release Linux.
- Hardening de runtime nativo no desktop.
- Estratégia de empacotamento Linux.
- Observabilidade e troubleshooting operacional.

### Fora de escopo
- Suporte oficial a Windows neste fork.
- Suporte ARM Linux nesta fase.
- Refatorações amplas do core não relacionadas à frente Linux.

## 4. Arquitetura de alto nível

Monorepo (Bun + Turbo)
- apps/desktop (Electron)
  - Main process: ciclo de vida, integração local, updater.
  - Renderer: interface e fluxos de usuário.
  - Runtime nativo: node-pty, watcher, sqlite/libsql, ast-grep.
  - Packaging: electron-builder para artefatos Linux.

Fronteiras:
- Alterações Linux devem ficar preferencialmente em paths de build/runtime desktop.
- Mudanças transversais exigem justificativa e ADR quando duráveis.

## 5. Canais de distribuição

- AppImage: canal universal Linux.
- .deb: canal oficial para Ubuntu.
- AUR (superset-bin): canal oficial para Arch.

## 6. Qualidade e gates

Gates mínimos de arquitetura para aceitar mudança:
1. SPEC definida com critérios verificáveis.
2. Testes/validações alinhados ao TDD.
3. Build Linux verde.
4. Smoke Linux verde.
5. Evidências registradas em relatório da feature.

## 7. Riscos arquiteturais

1. ABI/optional deps entre distros.
2. Regressões por updates rolling no Arch.
3. Drift do fork em relação ao upstream.

Mitigações:
- CI Linux com smoke obrigatório.
- Política de sync regular com upstream.
- ADR para decisões duráveis de runtime/build/distribuição.

## 8. Decisões duráveis

Toda decisão que altere contratos, política de build/release, ou distribuição deve ser registrada em `docs/adr/`.
