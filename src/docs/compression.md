# Compression

## Why Compression Is Required

Workflow graphs can contain many nodes and edges, especially for complex math
pipelines. Persisting raw JSON for every autosave inflates storage usage.

Using `lz-string` reduces payload size and keeps IndexedDB usage efficient.

## How lz-string Is Used

Implementation lives in `src/storage/compression.ts`.

Compression path:

1. `JSON.stringify(workflow)`
2. `compressToUTF16(serialized)`
3. store compressed string in `workflows.data`

Decompression path:

1. read compressed string from `workflows.data`
2. `decompressFromUTF16(data)`
3. `JSON.parse(decompressed)`

If decompression fails or parsed JSON is invalid, the module throws descriptive
errors indicating corrupted or invalid payload data.

## Compression Pipeline

```text
workflow graph ({ nodes, edges })
  ↓
JSON serialization
  ↓
lz-string compression (UTF16 string)
  ↓
IndexedDB record storage
```

## Benefits

- Lower per-workflow storage size.
- Faster transfer between repository and storage layer.
- Better scalability for large workflow graphs.
