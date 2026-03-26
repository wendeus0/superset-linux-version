# SPEC: 001-linux-distribution-smoke-gate

## 1. Objetivo

Formalizar a frente de distribuição Linux como canal oficial de release do Superset Desktop, com artefatos AppImage + .deb, gate de smoke Linux obrigatório em CI e base de automação para AUR (`superset-bin`).

O problema alvo é reduzir risco de regressão em runtime Linux e remover lacunas entre build, publicação e validação funcional mínima antes de release.

## 2. Escopo

### Em escopo
- Expandir packaging Linux para gerar `.deb` além de AppImage.
- Atualizar workflows de build/release para publicar e validar artefatos Linux esperados.
- Adicionar smoke gate Linux no CI para runtime desktop.
- Criar base de automação AUR (`PKGBUILD` template + script de bump/checksum + validação).
- Atualizar documentação operacional (SPEC, ADR, RELEASE, CONTEXT) para fluxo Linux oficial.

### Fora de escopo
- Suporte ARM Linux nesta fase.
- Publicação automática no AUR via credencial real.
- Refatorações amplas fora do pipeline de distribuição Linux.
- Mudanças de UX não relacionadas ao fluxo de build/release Linux.

## 3. Critérios de aceite

- [x] `apps/desktop/electron-builder.ts` produz AppImage e `.deb` em build Linux.
- [x] `build-desktop.yml` valida presença de AppImage, `.deb` e manifesto Linux.
- [x] `release-desktop.yml` e `release-desktop-canary.yml` publicam arquivos Linux com nomes estáveis para updater/download.
- [x] CI possui smoke gate Linux obrigatório antes da etapa de release.
- [x] Existe base AUR em repositório com template, script de bump/checksum e validação local.
- [x] `apps/desktop/RELEASE.md` documenta fluxo Linux oficial (AppImage + `.deb` + AUR).
- [x] `apps/desktop/scripts/smoke-linux.sh` estabelece suíte reproduzível com wrappers Ubuntu/Arch.
- [x] `apps/desktop/docs/linux-go-live-checklist.md` define checklist formal de M5.
- [x] `apps/desktop/docs/linux-triage-runbook.md` define triagem rápida operacional.
- [x] `CONTEXT.md` reflete transição de M4 concluída para M5 ativa e riscos residuais.

## 4. Plano técnico

### Arquivos/diretórios candidatos
- `apps/desktop/electron-builder.ts`
- `.github/workflows/build-desktop.yml`
- `.github/workflows/release-desktop.yml`
- `.github/workflows/release-desktop-canary.yml`
- `.github/workflows/ci.yml`
- `apps/desktop/RELEASE.md`
- `CONTEXT.md`
- `docs/adr/007-linux-distribution-smoke-gate-policy.md`
- `packaging/aur/superset-bin/PKGBUILD.template`
- `packaging/aur/scripts/bump-aur.sh`
- `packaging/aur/scripts/validate-aur.sh`

### Estratégia de implementação
- Configurar target Linux multi-artefato no electron-builder sem quebrar updater existente.
- Endurecer validação de artefatos no workflow de build para falhar cedo quando faltar `.deb`, AppImage ou manifesto.
- Garantir cópias estáveis de nome para release estável/canary, preservando compatibilidade do updater Linux.
- Introduzir smoke gate Linux explícito no CI, com etapa de build desktop + execução mínima de runtime checks.
- Estruturar automação inicial AUR como fluxo sem credenciais, focando em geração/validação determinística.
- Consolidar governança documental para reduzir drift operacional.

### Estratégia de testes
- Unit/integration existentes em `apps/desktop` para validar regressões de runtime.
- Execução local: `bun run compile:app`, `bun run package`, validação de artefatos Linux gerados.
- CI: gate obrigatório para smoke Linux antes de release.
- Validação AUR: script local para checksum, sintaxe de PKGBUILD e consistência de versão.

## 5. Riscos e mitigação

- Drift com upstream em workflows de release → manter mudanças localizadas e documentadas em ADR.
- Falha por diferenças de ambiente Linux (glibc/musl) → focar alvo oficial Ubuntu x64 e validar artefatos obrigatórios.
- Regressão no updater Linux por renome de artefatos → manter manifesto Linux estável (`latest-linux.yml` e `canary-linux.yml`).
- AUR quebrar por checksum/versionamento manual → centralizar bump em script com validação automatizada.

## 6. Evidências esperadas

- Comandos:
  - `cd apps/desktop && bun run compile:app`
  - `cd apps/desktop && bun run package -- --publish never --config electron-builder.ts`
  - `cd apps/desktop && ls -la release`
  - `bash packaging/aur/scripts/validate-aur.sh`
- Artefatos:
  - `apps/desktop/release/*.AppImage`
  - `apps/desktop/release/*.deb`
  - `apps/desktop/release/*-linux.yml`
  - logs de CI com smoke gate Linux verde

## 7. ADR relacionado

- [x] ADR existente: `docs/adr/007-linux-distribution-smoke-gate-policy.md`
