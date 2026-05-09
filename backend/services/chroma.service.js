import 'dotenv/config';

const BASE_URL = process.env.CHROMA_URL || 'http://localhost:8000';

// Cache of collection names we've already ensured exist
const _ensuredCollections = new Set();

/**
 * Ensure a ChromaDB collection exists, creating it if not.
 * Cached per process lifetime to avoid redundant requests.
 */
async function ensureCollection(name) {
  if (_ensuredCollections.has(name)) return;

  const res = await fetch(`${BASE_URL}/api/v1/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, metadata: { 'hnsw:space': 'cosine' } }),
  });

  // 409 means it already exists — that's fine
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`[chroma] ensureCollection failed (${res.status}): ${text}`);
  }

  _ensuredCollections.add(name);
}

/**
 * Get the internal ChromaDB collection ID by name.
 */
async function getCollectionId(name) {
  const res = await fetch(`${BASE_URL}/api/v1/collections/${name}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[chroma] getCollectionId failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.id;
}

/**
 * Upsert document chunks with their embeddings into a ChromaDB collection.
 *
 * @param {string}     collectionName - typically the subject name or 'default'
 * @param {string[]}   ids            - unique ID per chunk
 * @param {number[][]} embeddings     - vector per chunk
 * @param {string[]}   documents      - raw text per chunk
 * @param {object[]}   [metadatas]    - optional metadata per chunk
 */
export async function upsertChunks(collectionName, ids, embeddings, documents, metadatas = []) {
  try {
    await ensureCollection(collectionName);
    const collectionId = await getCollectionId(collectionName);

    const body = { ids, embeddings, documents };
    if (metadatas.length > 0) body.metadatas = metadatas;

    const res = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`[chroma] upsertChunks failed (${res.status}): ${text}`);
    }

    console.log(`[chroma] Upserted ${ids.length} chunks into "${collectionName}"`);
  } catch (err) {
    if (err.message.includes('Cannot reach') || err.code === 'ECONNREFUSED') {
      throw new Error(
        `[chroma] Cannot reach ChromaDB at ${BASE_URL}. Is it running?`
      );
    }
    throw err;
  }
}

/**
 * Query ChromaDB for the most relevant chunks given an embedding vector.
 *
 * @param {string}   collectionName
 * @param {number[]} queryEmbedding
 * @param {number}   nResults        - number of chunks to return (default: 5)
 * @returns {Promise<string[]>}      - array of chunk texts, most relevant first
 */
export async function queryChunks(collectionName, queryEmbedding, nResults = 5) {
  await ensureCollection(collectionName);
  const collectionId = await getCollectionId(collectionName);

  const res = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query_embeddings: [queryEmbedding],
      n_results: nResults,
      include: ['documents', 'distances'],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[chroma] queryChunks failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  // data.documents is [[chunk1, chunk2, ...]] — unwrap the outer array
  return data.documents?.[0] ?? [];
}

/**
 * Delete all chunks belonging to a specific document from a collection.
 * Uses ChromaDB's where filter on metadata.
 */
export async function deleteDocumentChunks(collectionName, documentId) {
  await ensureCollection(collectionName);
  const collectionId = await getCollectionId(collectionName);

  const res = await fetch(`${BASE_URL}/api/v1/collections/${collectionId}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ where: { document_id: documentId } }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[chroma] deleteDocumentChunks failed (${res.status}): ${text}`);
  }

  console.log(`[chroma] Deleted chunks for document ${documentId} from "${collectionName}"`);
}

/**
 * Health check — returns true if ChromaDB is reachable.
 */
export async function isHealthy() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/heartbeat`);
    return res.ok;
  } catch {
    return false;
  }
}
