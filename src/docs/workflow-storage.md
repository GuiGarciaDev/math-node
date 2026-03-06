# Workflow Storage

## Architecture

The application stores workflows entirely in the browser using IndexedDB.
Dexie.js is used as a typed wrapper over IndexedDB so reads and writes stay
asynchronous and non-blocking.

Storage layers:

1. UI and state updates happen in `flowStore.ts`.
2. Repository calls in `workflowRepository.ts` translate editor graph data into records.
3. Compression in `compression.ts` minimizes payload size before persistence.
4. Dexie in `db.ts` writes and reads data from IndexedDB.

## Database Schema

Database name: `workflowDB`

Table: `workflows`

Indexed fields:

- `id`
- `name`
- `updatedAt`

Record shape:

```ts
{
  id: string
  name: string
  createdAt: number
  updatedAt: number
  data: string // compressed JSON payload of { nodes, edges }
}
```

## Workflow Lifecycle

Create flow:

1. User starts a new workflow or selects a template.
2. Repository writes a new record using `saveWorkflow`.
3. Store opens a workflow session and starts autosave for that workflow id.

Edit flow:

1. User edits nodes/edges in the canvas.
2. Store updates local state immediately.
3. Autosave receives the latest graph and schedules debounced persistence.

Load flow:

1. Landing page lists summaries from `listWorkflows()`.
2. Selecting a card loads full workflow via `loadWorkflow(id)`.
3. Repository decompresses and parses `data` before returning graph data.

Delete flow:

1. Repository deletes the record by id with `deleteWorkflow(id)`.

## Performance Optimizations

- Data is compressed before writes to reduce IndexedDB footprint.
- Autosave is debounced to avoid writes on every drag/move event.
- IndexedDB interactions are async to avoid blocking rendering.
- Landing page lists metadata only, and loads graph payload lazily by id.

## Why IndexedDB

IndexedDB is a good fit for browser-only apps because it supports:

- Persistent storage across reloads.
- Larger capacity than localStorage.
- Asynchronous APIs suited for large graph payloads.
- Structured record storage with indexed queries.
