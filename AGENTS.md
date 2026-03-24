# AGENTS.md — superset-linux-version

Fonte de verdade do fork. Em conflito com instruções genéricas, este arquivo prevalece.

## Objetivo

Este fork adapta o Superset Desktop para Linux (Arch e Ubuntu), preservando alinhamento com o upstream e tratando Linux como plataforma de primeira classe no ciclo de build, runtime e distribuição.

## Fontes de verdade (hierarquia)

1. `AGENTS.md` (este arquivo)
2. `CONTEXT.md`
3. `docs/architecture/SDD.md`
4. `docs/architecture/TDD.md`
5. `docs/architecture/SPEC_FORMAT.md`
6. `docs/adr/*.md`
7. Documentação técnica local em `apps/desktop/docs/` (quando específica da implementação)

Em conflito:
- `SPEC` da feature governa o escopo da entrega;
- `SDD` governa arquitetura;
- `TDD` governa estratégia de teste;
- decisões duráveis devem virar ADR.

## Workflow oficial

```text
SPEC → TEST_RED → CODE_GREEN → REFACTOR → QUALITY_GATE → SECURITY_REVIEW → REPORT → COMMIT
```

## Regras críticas

1. Uma feature por vez.
2. Não misturar Linux port com refactors amplos sem relação direta.
3. Toda alteração de empacotamento/runtime Linux exige teste ou smoke correspondente.
4. Toda decisão arquitetural durável exige ADR.
5. Atualizar `CONTEXT.md` ao fechar macrofases.
6. Minimizar divergência com upstream; preferir patches localizados.
7. Critérios de aceite devem ser verificáveis por evidência (comando, log, artefato).

## Escopo Linux prioritário

- Ubuntu 22.04/24.04 (x64)
- Arch Linux rolling (x64)
- Canais: AppImage + `.deb` + AUR (`superset-bin`)

## Convenções documentais

- `AGENTS.md` define governança e regras de execução.
- `CONTEXT.md` registra estado operacional vivo da frente ativa.
- `docs/architecture/` centraliza design e estratégia de implementação.
- `docs/adr/` registra decisões arquiteturais de longo prazo.

## Definition of Done (DoD)

Uma entrega Linux está pronta quando:
- build Linux passa em CI;
- smoke Linux passa em CI;
- runtime nativo relevante foi validado no escopo da feature;
- documentação de instalação/troubleshooting foi atualizada quando aplicável;
- riscos residuais estão registrados no relatório da feature.
