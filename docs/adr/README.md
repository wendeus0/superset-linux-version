# ADRs — Architecture Decision Records

Este diretório registra decisões arquiteturais duráveis do fork.

## Convenção

- Arquivos numerados em sequência: `NNN-slug-kebab-case.md`
- Exemplo: `006-linux-package-signing-policy.md`
- Uma decisão por arquivo

## Estrutura mínima de ADR

```md
# ADR NNN — Título

## Status
Accepted | Proposed | Superseded

## Contexto
Problema, restrições e motivação.

## Decisão
Decisão tomada de forma objetiva.

## Consequências
Trade-offs, impactos e riscos.

## Referências
Links para PR, issue, SPEC, testes e evidências.
```

## Quando criar ADR

- mudança de arquitetura de runtime;
- mudança de estratégia de build/distribuição;
- mudança de política operacional durável;
- mudança que altere contratos entre módulos.
