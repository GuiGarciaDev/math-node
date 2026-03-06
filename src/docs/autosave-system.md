# Autosave System

## Debounce Strategy

Autosave is implemented in `src/storage/autosave.ts` using `lodash.debounce`
with a 2000ms delay.

Behavior:

1. Any node or edge mutation updates store state immediately.
2. The store subscription forwards latest graph state to `triggerAutosave`.
3. Debounce waits for 2 seconds of inactivity.
4. A single `saveWorkflow` call persists the latest state.

## Autosave Timing

Configured delay:

- `AUTOSAVE_DELAY_MS = 2000`

Timeline:

```text
edit
  ↓
triggerAutosave
  ↓
2s debounce window
  ↓
saveWorkflow (IndexedDB write)
```

## Why Debounced Autosave

Node editors generate many rapid updates while users drag, connect, and tweak
parameters. Writing every event directly to IndexedDB would create unnecessary
I/O and reduce responsiveness.

Debounce improves behavior by:

- Coalescing rapid updates into one write.
- Reducing disk operations and GC pressure.
- Preserving smooth drag and interaction performance.
- Keeping persistence reliable after user pauses.

## API

- `createAutosave(workflowId, workflowName)` initializes autosave context.
- `triggerAutosave(workflow)` queues a debounced write.
- `cancelAutosave()` cancels pending writes.
