# Linux CI/Release Runbook (fonte única operacional)

Este documento é a referência canônica para execução e triagem do fluxo Linux no fork `superset-linux-version`.

## 1. Fluxo oficial

1) CI (`.github/workflows/ci.yml`)
- Gates bloqueantes de qualidade:
  - `linux-smoke` (workflow reutilizável)
  - `linux-critical-regression`
- Build só roda após gates Linux.

2) Release Stable (`.github/workflows/release-desktop.yml`)
- `linux-smoke` bloqueante
- `build` desktop
- `release` com verificação de contrato Linux estável antes do publish draft

3) Release Canary (`.github/workflows/release-desktop-canary.yml`)
- `check-changes` -> `linux-smoke` (quando should_build=true) -> `build` -> `release`
- Verificação de contrato Linux canary antes de publicar prerelease

## 2. Contrato de artefatos Linux

Stable (obrigatórios):
- Versionados: `*.AppImage`, `*.deb`, `*-linux.yml`
- Estáveis: `Superset-x86_64.AppImage`, `Superset-amd64.deb`, `latest-linux.yml`

Canary (obrigatórios):
- Versionados: `*.AppImage`, `*.deb`, `*-linux.yml`
- Estáveis: `Superset-Canary-x86_64.AppImage`, `Superset-Canary-amd64.deb`, `canary-linux.yml`, `latest-linux.yml`

## 3. Evidência mínima por gate

Para cada execução, registrar:
- URL da run
- Commit/tag
- Jobs críticos e status
- Comandos locais (quando aplicável)
- Artefatos anexados e aliases estáveis

## 4. Comandos de verificação local

No root:

```bash
bun install --frozen --ignore-scripts
```

No `apps/desktop`:

```bash
bun run install:deps
bun run smoke:linux -- --profile ubuntu --skip-install --ci
```

Validação estendida:

```bash
bun run smoke:linux -- --profile ubuntu --with-package
```

## 5. Política de avanço/retrocesso

Avanço:
- `linux-smoke` verde
- `linux-critical-regression` verde
- Contrato de artefatos válido no release

Retrocesso:
- Falha de contrato de artefato
- Falha de smoke gate em main/release
- Regressão crítica Linux pós-publicação

Ação imediata de rollback:
1. Pausar divulgação Linux
2. Abrir incidente com evidência
3. Corrigir pipeline/artefato e refazer tag/release

## 6. Referências normativas

- `apps/desktop/RELEASE.md`
- `apps/desktop/docs/linux-go-live-checklist.md`
- `apps/desktop/docs/linux-triage-runbook.md`
- `docs/architecture/specs/001-linux-distribution-smoke-gate.md`
- `docs/adr/007-linux-distribution-smoke-gate-policy.md`
