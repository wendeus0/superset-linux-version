# ADR-006 — Alinhamento de governança documental ao padrão multi-repo

Status: Accepted
Date: 2026-03-24

## Context

Os repositórios de referência (Lexio, albion-market-insights e SynapseOS) compartilham um padrão de governança documental com:

- AGENTS.md como contrato operacional do repositório;
- CONTEXT.md como estado operacional da frente ativa;
- docs/architecture como fonte de desenho técnico e estratégia;
- docs/adr como trilha de decisões duráveis.

Este fork já possuía parte dessa estrutura, mas sem indexação/documentação de uso padronizada em todos os diretórios.

## Decision

Adotar formalmente o mesmo padrão documental no fork, com os seguintes artefatos mínimos e papéis:

1. `AGENTS.md` define hierarquia de fontes de verdade, workflow e regras de governança.
2. `CONTEXT.md` registra estado atual, fase ativa, backlog macro e critérios operacionais.
3. `docs/architecture/README.md` indexa os documentos estruturais e ordem de leitura.
4. `docs/architecture/SPEC_TEMPLATE.md` fornece template operacional de SPEC por feature.
5. `docs/adr/README.md` define convenção de ADR e template mínimo.

## Consequences

### Positivas

- Menor custo de troca de contexto entre repositórios do mesmo mantenedor.
- Onboarding mais rápido para novas frentes de trabalho.
- Maior rastreabilidade entre decisão técnica, execução e evidências.

### Trade-offs

- Leve aumento de manutenção documental por feature.
- Requer disciplina para manter `CONTEXT.md` e ADRs atualizados.

## References

- `AGENTS.md`
- `CONTEXT.md`
- `docs/architecture/README.md`
- `docs/architecture/SPEC_FORMAT.md`
- `docs/architecture/SPEC_TEMPLATE.md`
- `docs/adr/README.md`
