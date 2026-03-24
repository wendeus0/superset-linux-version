# SPEC_FORMAT.md — Contrato de SPEC por feature
# superset-linux-version

Versão: 1.0
Status: Ativo

## 1. Objetivo do documento

Definir formato obrigatório de SPEC para manter escopo controlado, critérios verificáveis e rastreabilidade da entrega.

## 2. Estrutura mínima obrigatória

Toda SPEC deve conter, nesta ordem:

1. Identificação
- `# SPEC: <NNN>-<slug-kebab-case>`

2. Objetivo
- resultado funcional esperado;
- problema que será resolvido.

3. Escopo
- Em escopo
- Fora de escopo

4. Critérios de aceite
- checklist verificável (`- [ ] ...`)
- sem critérios ambíguos ou não testáveis

5. Plano técnico
- arquivos/diretórios candidatos
- estratégia de implementação
- estratégia de testes (unit/integration/smoke quando aplicável)

6. Riscos e mitigação
- risco → mitigação objetiva

7. Evidências esperadas
- comandos de validação
- artefatos/logs esperados

8. ADR
- informar se não aplica, se referencia ADR existente, ou se exige ADR nova

## 3. Regras de validação da SPEC

1. Uma SPEC por feature.
2. Escopo deve ser fechado e não misturado com outras frentes.
3. Critérios de aceite precisam ser observáveis por teste, comando ou artefato.
4. Mudança arquitetural durável sem ADR é inválida.
5. Se faltar informação crítica, reduzir escopo e registrar lacuna.

## 4. Relação com outros documentos

- `SDD.md` governa arquitetura.
- `TDD.md` governa estratégia de testes.
- `AGENTS.md` governa fluxo e regras do repositório.
- `CONTEXT.md` governa estado operacional da fase ativa.

## 5. Template operacional

Para iniciar rapidamente uma SPEC nova, usar `docs/architecture/SPEC_TEMPLATE.md`.
