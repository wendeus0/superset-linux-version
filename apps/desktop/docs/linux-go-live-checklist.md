# Linux Go-live Checklist (M5)

Checklist operacional para decisão de go-live Linux do Superset Desktop.

## Escopo

- Plataforma alvo oficial: Ubuntu 22.04/24.04 (x64) e Arch Linux rolling (x64).
- Artefatos oficiais: AppImage + `.deb` + manifesto Linux (`latest-linux.yml`).
- Canal Arch: base AUR `superset-bin` validada e pronta para publicação manual.

## Pré-condições obrigatórias

- [ ] CI `linux-smoke` verde em `main` após mudança de release.
- [ ] Workflow `Release Desktop App` executado sem falha nas etapas `linux-smoke`, `build` e `release`.
- [ ] Workflow `Release Desktop Canary` saudável no último ciclo (quando houver mudança relevante).
- [ ] Artefatos Linux esperados presentes na release tag:
  - [ ] `*.AppImage`
  - [ ] `*.deb`
  - [ ] `latest-linux.yml`
- [ ] URLs estáveis validadas:
  - [ ] `.../releases/latest/download/Superset-x86_64.AppImage`
  - [ ] `.../releases/latest/download/Superset-amd64.deb`
  - [ ] `.../releases/latest/download/latest-linux.yml`

## Gate de smoke Linux (local/CI)

Executar no `apps/desktop`:

```bash
bun run smoke:linux -- --profile ubuntu --skip-install --ci
```

Evidência mínima esperada:
- compile concluído
- `copy:native-modules` + `validate:native-runtime` concluídos
- sem erro de runtime Linux

Opcional para validação estendida de artefatos:

```bash
bun run smoke:linux -- --profile ubuntu --with-package
```

## Validação Arch (canal AUR)

No root do monorepo:

```bash
./packaging/aur/scripts/bump-aur.sh <version>
./packaging/aur/scripts/validate-aur.sh
```

Aceite:
- `PKGBUILD` sem placeholders
- checksum coerente com AppImage da tag
- sintaxe básica válida

## Publicação controlada (M5)

- [ ] Release criada inicialmente como draft.
- [ ] Revisão humana dos artefatos Linux anexados.
- [ ] Checklist concluído integralmente.
- [ ] Apenas então publicar draft (`--draft=false`).

## Critério de rollback

Reverter para estado pré-go-live se qualquer item abaixo ocorrer:
- ausência de AppImage/.deb/manifesto na release
- falha no smoke Linux em `main`
- regressão crítica de runtime Linux pós-publicação

Ações de contenção:
1. pausar divulgação de instalação Linux
2. abrir incidente interno e registrar falha
3. cortar nova tag corrigindo pipeline/artefato

## Evidence Pack mínimo (obrigatório)

Para cada release candidata, anexar:
- URL da run CI/release
- commit/tag
- status dos jobs críticos (`linux-smoke`, `linux-critical-regression`, `build`, `release`)
- comandos locais executados (quando aplicável)
- lista de artefatos gerados e aliases estáveis
- responsável pela validação

## Registro de decisão

Ao concluir o go-live, registrar:
- tag aprovada
- evidências de CI
- evidências de smoke local
- responsável pela aprovação
- riscos residuais aceitos
