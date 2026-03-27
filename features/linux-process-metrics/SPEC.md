# SPEC: 002-linux-process-metrics

## 1. Objetivo

Implementar `@superset/linux-process-metrics` — package TypeScript puro que lê `/proc/<pid>/smaps_rollup` para retornar PSS (Proportional Set Size) por PID no Linux. O package expõe a mesma interface de `@superset/macos-process-metrics` (`getPhysFootprints`), permitindo que `process-tree.ts` enriqueça snapshots de memória com métrica mais precisa que RSS em Linux.

PSS é o equivalente Linux mais próximo do `ri_phys_footprint` do macOS: contabiliza memória compartilhada proporcionalmente (sem inflar com páginas compartilhadas somadas N vezes).

## 2. Escopo

### Em escopo
- Criar `packages/linux-process-metrics/` com `src/index.ts`, `package.json`, `index.d.ts`
- Função: `getPhysFootprints(pids: number[]): Record<number, number>` — lê `/proc/<pid>/smaps_rollup`, extrai `Pss:` em kB, retorna mapa PID → bytes
- Fallback gracioso: PID inacessível ou `/proc` ausente → omitir PID do resultado (não lançar)
- Integrar em `apps/desktop/src/main/lib/resource-metrics/process-tree.ts` via `enrichWithLinuxFootprint()` (análogo a `enrichWithPhysFootprint()`)
- Adicionar entry em `apps/desktop/runtime-dependencies.ts`
- Adicionar dependency em `apps/desktop/package.json`
- Testes unitários com mock de `fs/promises` cobrindo: PID válido, PID inacessível, `/proc` ausente, array vazio

### Fora de escopo
- Native C++ addon (não necessário — `/proc` é acessível via `fs`)
- Suporte a macOS ou Windows neste package
- Alterar `@superset/macos-process-metrics`
- Métricas além de PSS (CPU%, swap, etc.)
- ARM Linux (declarar como fora de escopo nesta fase)

## 3. Critérios de aceite

- [ ] `getPhysFootprints([pid])` retorna `{ [pid]: <pss_bytes> }` ao ler `/proc/<pid>/smaps_rollup` com campo `Pss` válido
- [ ] PIDs inacessíveis (EACCES, ENOENT) são omitidos do resultado sem lançar exceção
- [ ] Array vazio retorna `{}`
- [ ] Em plataforma não-Linux (`process.platform !== 'linux'`) retorna `{}` imediatamente
- [ ] `process-tree.ts` chama `enrichWithLinuxFootprint()` no Linux (equivalente à chamada macOS existente)
- [ ] `bun run typecheck` verde em `packages/linux-process-metrics` e `apps/desktop`
- [ ] `bun run lint` verde nos arquivos modificados
- [ ] Testes unitários passam: ≥ 4 casos (PID válido, EACCES, ENOENT, array vazio)

## 4. Plano técnico

### Arquivos/diretórios candidatos

- `packages/linux-process-metrics/package.json` — novo
- `packages/linux-process-metrics/src/index.ts` — novo (implementação)
- `packages/linux-process-metrics/index.d.ts` — novo (tipos exportados)
- `packages/linux-process-metrics/test/index.test.ts` — novo (testes unitários)
- `apps/desktop/src/main/lib/resource-metrics/process-tree.ts` — modificado (import + `enrichWithLinuxFootprint`)
- `apps/desktop/runtime-dependencies.ts` — modificado (adicionar entry para o novo package)
- `apps/desktop/package.json` — modificado (adicionar `@superset/linux-process-metrics: workspace:*`)

### Estratégia de implementação

1. Criar package TypeScript puro em `packages/linux-process-metrics/`
2. `src/index.ts`:
   - Guard `process.platform !== 'linux'` → retornar `{}`
   - Para cada PID: `fs.readFile('/proc/<pid>/smaps_rollup', 'utf8')`
   - Extrair linha `Pss:` com regex → parsear kB → converter para bytes
   - Coleta erros por PID individualmente (Promise.allSettled), omitir falhos
3. Atualizar `process-tree.ts`:
   - Import lazy (try/catch) de `@superset/linux-process-metrics` no topo
   - Adicionar `enrichWithLinuxFootprint()` espelhando `enrichWithPhysFootprint()`
   - Chamar `enrichWithLinuxFootprint()` quando `os.platform() === 'linux'`
4. Atualizar `runtime-dependencies.ts` e `package.json` do desktop

### Estratégia de testes

- Unitário em `packages/linux-process-metrics/test/index.test.ts`
- Mock de `node:fs/promises` usando `bun:test` mocks
- Casos:
  - PID válido com `smaps_rollup` sintético → valor PSS correto em bytes
  - PID inacessível (EACCES) → omitido, sem erro
  - PID não existe (ENOENT) → omitido, sem erro
  - `pids = []` → `{}`
  - `process.platform !== 'linux'` → `{}` (mock via module stub ou guard testável)

## 5. Riscos e mitigação

- **`/proc/<pid>/smaps_rollup` requer kernel ≥ 4.14** → Ubuntu 18.04+ e Arch rolling cobrem; documentar restrição no package; fallback já existe (RSS de `ps`)
- **EPERM em leitura de `/proc` de processos de outro usuário** → tratado via try/catch por PID; omitir silenciosamente
- **Performance com muitos PIDs** → `Promise.allSettled` paralelo; aceitável para os ~10–50 PIDs típicos de uma sessão
- **Drift de interface com macOS package** → manter `index.d.ts` idêntico ao do macOS package

## 6. Evidências esperadas

- Comandos:
  - `bun test` em `packages/linux-process-metrics` (≥ 4 testes verdes)
  - `bun run typecheck` em `packages/linux-process-metrics` e `apps/desktop`
  - `bun run lint` nos arquivos modificados
- Artefatos:
  - Output `bun test` com 4+ casos PASS
  - Output typecheck limpo (0 errors)
  - Output lint limpo

## 7. ADR relacionado

- [ ] ADR novo recomendado: decisão de implementar Linux process metrics via leitura de `/proc` (TypeScript puro) em vez de native NAPI addon — durável, com trade-off explícito (sem bindings nativos vs. precisão ligeiramente inferior ao macOS phys_footprint)
