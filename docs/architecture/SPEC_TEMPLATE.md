# TEMPLATE — SPEC de feature

Use este template para abrir uma nova feature no fork.

```markdown
# SPEC: <NNN>-<slug-kebab-case>

## 1. Objetivo

Descreva o resultado funcional esperado em 2-4 linhas.

## 2. Escopo

### Em escopo
- Item 1
- Item 2

### Fora de escopo
- Item 1
- Item 2

## 3. Critérios de aceite

- [ ] Critério verificável 1
- [ ] Critério verificável 2
- [ ] Critério verificável 3

## 4. Plano técnico

### Arquivos/diretórios candidatos
- `path/a`
- `path/b`

### Estratégia de implementação
- Passo técnico 1
- Passo técnico 2

### Estratégia de testes
- Teste unitário
- Teste integração
- Smoke Linux

## 5. Riscos e mitigação

- Risco 1 → mitigação
- Risco 2 → mitigação

## 6. Evidências esperadas

- Comandos:
  - `bun run lint`
  - `bun run build`
  - `<comando de smoke da feature>`
- Artefatos:
  - logs
  - screenshots
  - output de CI

## 7. ADR relacionado

- [ ] Não aplica
- [ ] ADR existente: `docs/adr/NNN-<slug>.md`
- [ ] Novo ADR necessário (mudança durável)
```

## Notas de uso

- Uma SPEC por feature.
- Critérios de aceite devem ser testáveis.
- Se houver decisão arquitetural durável, abrir ADR antes do commit final.
