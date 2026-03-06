import { compressToUTF16, decompressFromUTF16 } from "lz-string"

export function compressWorkflow(workflow: unknown): string {
  const serialized = JSON.stringify(workflow)
  const compressed = compressToUTF16(serialized)

  if (!compressed) {
    throw new Error("Failed to compress workflow payload.")
  }

  return compressed
}

export function decompressWorkflow<T>(compressed: string): T {
  if (!compressed) {
    throw new Error("Failed to decompress workflow payload: empty payload.")
  }

  const decompressed = decompressFromUTF16(compressed)

  if (decompressed === null) {
    throw new Error(
      "Failed to decompress workflow payload: data is corrupted or invalid.",
    )
  }

  try {
    return JSON.parse(decompressed) as T
  } catch {
    throw new Error(
      "Failed to decompress workflow payload: decompressed data is not valid JSON.",
    )
  }
}
