# TDD.md — Test-Driven Development Strategy
# superset-linux-version (Linux)

Versão: 1.0
Status: Ativo

## 1. Estratégia

Aplicar ciclo explícito por feature:
1. TEST_RED: escrever teste que falha para o comportamento alvo.
2. CODE_GREEN: implementar o mínimo para passar.
3. REFACTOR: melhorar estrutura sem quebrar contrato.

Workflow oficial:
SPEC → TEST_RED → CODE_GREEN → REFACTOR → QUALITY_GATE → SECURITY_REVIEW → REPORT → COMMIT

## 2. Pirâmide de validação

### Unit
- resolução de plataforma/path Linux;
- validações de config/scripts de build;
- regras de fallback em componentes críticos.

### Integration
- terminal host em fluxo básico;
- carregamento de runtime nativo em cenário realista;
- integração com updater/manifesto Linux quando aplicável.

### Smoke (gate de release Linux)
- app sobe sem crash;
- terminal integrado executa comando simples;
- watcher opera em workspace real;
- artefatos Linux esperados são produzidos/publicados.

## 3. Regras obrigatórias

1. Sem CODE_GREEN antes de TEST_RED válido.
2. Sem REFACTOR antes do verde.
3. Alteração de empacotamento/runtime Linux exige teste/smoke correspondente.
4. Critérios da SPEC devem virar verificações objetivas.

## 4. Quality gate mínimo

Antes de fechar a feature:
- lint/typecheck (quando aplicável) verdes;
- build Linux verde;
- smoke Linux verde;
- sem regressões introduzidas no escopo validado.

## 5. Evidências esperadas

Cada feature deve anexar evidência executável/reprodutível:
- comandos executados;
- resultado dos testes;
- logs/artefatos relevantes;
- riscos residuais.

## 6. Critérios de parada

Parar e reabrir SPEC se:
- teste contradiz a SPEC;
- não há critério verificável claro;
- mudança exige escopo arquitetural não previsto sem ADR.
