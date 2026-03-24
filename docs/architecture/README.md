# Arquitetura — índice

Este diretório concentra os documentos estruturais do fork.

## Documentos base

- `SDD.md` — desenho de arquitetura e fronteiras do sistema.
- `TDD.md` — estratégia de testes e gates de qualidade.
- `SPEC_FORMAT.md` — contrato mínimo de especificação por feature.
- `SPEC_TEMPLATE.md` — template operacional para iniciar SPECs novas.
- `IMPLEMENTATION_STACK.md` — stack técnica adotada.
- `WORKTREE_FEATURES.md` — convenção de branches/worktrees por feature.
- `PHASE_2_ROADMAP.md` — roadmap técnico da fase corrente.

## Ordem de leitura recomendada

1. `SDD.md`
2. `TDD.md`
3. `SPEC_FORMAT.md`
4. demais documentos de apoio

## Regra de manutenção

Sempre que houver mudança estrutural durável:

1) atualize o documento de arquitetura impactado;
2) registre decisão e trade-off em `docs/adr/`.
