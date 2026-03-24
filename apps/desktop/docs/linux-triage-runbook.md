# Linux Triage Runbook (rápido)

Guia de triagem para falhas Linux em build/release/runtime do Superset Desktop.

## 1) Classificação inicial

Identifique rapidamente onde quebrou:

- Classe A — CI smoke gate (`linux-smoke`)
- Classe B — build/release artifact (AppImage/.deb/manifesto)
- Classe C — updater/download URL estável
- Classe D — AUR (`PKGBUILD`/checksum)

## 2) Comandos de diagnóstico base

No root:

```bash
bun install --frozen --ignore-scripts
```

No `apps/desktop`:

```bash
bun run install:deps
bun run smoke:linux -- --profile ubuntu --skip-install
```

Se falhar, repetir com logs completos:

```bash
bun run smoke:linux -- --profile ubuntu
```

## 3) Playbook por classe

### Classe A — Falha no smoke gate

Sintomas comuns:
- erro em `compile:app`
- erro em `copy:native-modules`
- erro em `validate:native-runtime`

Ações:
1. reproduzir local com `bun run smoke:linux -- --profile ubuntu`
2. validar mudanças recentes em:
   - `apps/desktop/electron.vite.config.ts`
   - `apps/desktop/electron-builder.ts`
   - `apps/desktop/scripts/validate-native-runtime.ts`
3. abrir fix com teste/evidência mínima antes de novo release

### Classe B — Artefato Linux ausente

Checagem:

```bash
cd apps/desktop
ls -la release
```

Esperado:
- `*.AppImage`
- `*.deb`
- `*-linux.yml`

Ações:
1. confirmar target linux em `electron-builder.ts`
2. rodar `bun run smoke:linux -- --profile ubuntu --with-package`
3. corrigir e validar em CI antes de retag

### Classe C — URL estável quebrada

Checar workflow de release:
- `.github/workflows/release-desktop.yml`
- `.github/workflows/release-desktop-canary.yml`

Pontos críticos:
- cópia para `Superset-x86_64.AppImage`
- cópia para `Superset-amd64.deb`
- cópia para `latest-linux.yml`

Ações:
1. corrigir etapa de cópia
2. gerar nova tag
3. validar endpoint `/releases/latest/download/...`

### Classe D — Falha AUR

Comandos:

```bash
./packaging/aur/scripts/bump-aur.sh <version>
./packaging/aur/scripts/validate-aur.sh
```

Ações:
1. corrigir URL/checksum do AppImage
2. garantir `PKGBUILD` sem placeholders
3. repetir validação

## 4) Critério de severidade

- Sev-1: release Linux publicada com artefato inválido/ausente
- Sev-2: smoke gate quebrado bloqueando release
- Sev-3: falha apenas no fluxo AUR manual

## 5) Encerramento da triagem

Antes de fechar incidente:
- [ ] causa raiz identificada
- [ ] correção validada em smoke Linux
- [ ] evidência anexada (log/comando)
- [ ] ação preventiva registrada (doc/workflow/test)
