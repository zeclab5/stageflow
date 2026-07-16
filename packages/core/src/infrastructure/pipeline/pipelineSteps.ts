import { createHash } from 'node:crypto';

export function fileFingerprint(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export function extToKind(path: string): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown' {
  const value = path.split('.').pop()?.toLowerCase() ?? '';
  if (['png','jpg','jpeg','webp','gif','bmp','tiff','avif'].includes(value)) return 'image';
  if (['mp4','mov','avi','mkv','webm'].includes(value)) return 'video';
  if (['mp3','wav','flac','aac','ogg','m4a'].includes(value)) return 'audio';
  if (['pdf','doc','docx','txt','md','markdown','ppt','pptx','xls','xlsx','csv'].includes(value)) return 'document';
  if (['zip','tar','gz','7z','rar'].includes(value)) return 'archive';
  return 'unknown';
}

export function detectKind(assetPath: string): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown' {
  return extToKind(assetPath);
}

export async function readStats(assetPath: string): Promise<{ bytes: number; modifiedAt: Date }> {
  try {
    const { stat } = await import('node:fs/promises');
    const info = await stat(assetPath);
    return { bytes: info.size, modifiedAt: new Date(info.mtimeMs) };
  } catch {
    return { bytes: 0, modifiedAt: new Date() };
  }
}

export class MetadataExtractionStep {
  async execute(kind: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown', assetPath: string) {
    const metadata: Record<string, unknown> = { source: 'local', kind };
    try {
      const { stat } = await import('node:fs/promises');
      const info = await stat(assetPath);
      metadata.stats = { bytes: info.size, mtime: new Date(info.mtimeMs).toISOString() };
    } catch {/* ignore stat errors */}
    try {
      const pathBasename = assetPath.split(/[/\\]/).pop() ?? assetPath;
      const parts = pathBasename.split('.');
      if (parts.length > 1) metadata.extension = parts.pop()?.toLowerCase();
    } catch {/* ignore basename errors */}
    return { metadata };
  }
}

export class ThumbnailGeneratorStep {
  async execute(kind: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown', assetPath: string) {
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const { existsSync, mkdirSync } = await import('node:fs');
    const root = join(tmpdir(), 'stageflow-pipeline');
    if (!existsSync(root)) mkdirSync(root, { recursive: true });
    const runId = `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const fallback = join(root, `${runId}.png`);
    if (kind === 'image') return { thumbnailPath: assetPath, thumbnailUri: `file://${assetPath}` };
    return { thumbnailPath: fallback, thumbnailUri: `file://${fallback}` };
  }
}

export class CacheCreationStep {
  async execute(thumbnailUri: string, metadata: Record<string, unknown>) {
    const cache = { meta: metadata, thumbnailUri, generatedAt: new Date().toISOString() };
    return { cacheMeta: cache };
  }
}

export class SearchIndexStep {
  async execute(kind: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown', metadata: Record<string, unknown>) {
    const terms: string[] = [String(kind), 'stageflow-asset'];
    try {
      const parsed = JSON.parse(String(metadata.stats ?? ''));
      if (parsed?.bytes) terms.push(`bytes:${parsed.bytes}`);
    } catch {
      // ignore index parse errors
    }
    return { terms, indexed: true };
  }
}
