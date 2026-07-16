import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileFingerprint, extToKind, MetadataExtractionStep, ThumbnailGeneratorStep, CacheCreationStep, SearchIndexStep } from './pipelineSteps';
import type { AssetPipelineRun, AssetPipelineRunRepository, AssetPipelineRunId, AssetPipelineProjectId, AssetPipelineStage, AssetKind } from '../../domain/asset/AssetPipeline';
import { eventBus } from '../../infrastructure/event/EventBus';

function stableRunId(path: string): AssetPipelineRunId {
  const mtime = statSync(path).mtimeMs;
  return `pipeline_${fileFingerprint(Buffer.from(`${path}:${mtime}`)).slice(0, 24)}` as AssetPipelineRunId;
}

export interface ExecuteOptions {
  readonly root: string;
  readonly projectId: string;
  readonly repository: AssetPipelineRunRepository;
  readonly now?: Date;
}

export class AssetPipelineRunner {
  private readonly metadata = new MetadataExtractionStep();
  private readonly thumbnail = new ThumbnailGeneratorStep();
  private readonly cache = new CacheCreationStep();
  private readonly index = new SearchIndexStep();

  async execute({ root, projectId, repository, now = new Date() }: ExecuteOptions): Promise<AssetPipelineRun[]> {
    const runs: AssetPipelineRun[] = [];
    if (!existsSync(root)) return runs;
    const entries = readdirSync(root, { withFileTypes: true, recursive: true }).filter((entry) => entry.isFile());
    for (const entry of entries) {
      const path = join(entry.parentPath, entry.name);
      const kind = extToKind(path);
      const base = this.baseRun(path, projectId, kind, now);
      let run: AssetPipelineRun = {
        ...base,
        currentStage: 'detect',
        status: 'queued',
        attempts: 0,
        metadata: {},
        thumbnailUri: '',
        cacheUri: '',
        indexed: false,
        error: '',
      };
      await repository.save(run);

      run = await this.metadataStage(run, kind, path);
      await repository.save(run);
      run = await this.thumbnailStage(run, kind, path);
      await repository.save(run);
      run = await this.cacheStage(run);
      await repository.save(run);
      run = await this.indexStage(run, kind);
      await repository.save(run);

      const completed: AssetPipelineRun = { ...run, currentStage: 'completed', status: 'succeeded' };
      await repository.save(completed);
      await eventBus.publish({ occurredAt: now, eventType: 'AssetPipelineRunCompleted' });
      runs.push(completed);
    }
    return runs;
  }

  private baseRun(path: string, projectId: string, kind: AssetKind, now: Date): Omit<AssetPipelineRun, 'status' | 'currentStage' | 'attempts' | 'metadata' | 'thumbnailUri' | 'cacheUri' | 'indexed' | 'error'> {
    return {
      id: stableRunId(path),
      assetId: fileFingerprint(Buffer.from('')),
      projectId: projectId as AssetPipelineProjectId,
      sourceUri: `file://${path}`,
      kind,
      occurredAt: now,
    };
  }

  private async metadataStage(run: AssetPipelineRun, kind: AssetKind, path: string): Promise<AssetPipelineRun> {
    const stage: AssetPipelineStage = 'metadata';
    return {
      ...run,
      currentStage: stage,
      status: 'running',
      attempts: run.attempts + 1,
      metadata: (await this.metadata.execute(kind, path)).metadata,
    };
  }

  private async thumbnailStage(run: AssetPipelineRun, kind: AssetKind, path: string): Promise<AssetPipelineRun> {
    const stage: AssetPipelineStage = 'thumbnail';
    const thumbnail = await this.thumbnail.execute(kind, path);
    return { ...run, currentStage: stage, thumbnailUri: thumbnail.thumbnailUri };
  }

  private async cacheStage(run: AssetPipelineRun): Promise<AssetPipelineRun> {
    const stage: AssetPipelineStage = 'cache';
    const cacheResult = await this.cache.execute(run.thumbnailUri, run.metadata);
    return { ...run, currentStage: stage, cacheUri: cacheResult.cacheMeta.thumbnailUri };
  }

  private async indexStage(run: AssetPipelineRun, kind: AssetKind): Promise<AssetPipelineRun> {
    const stage: AssetPipelineStage = 'index';
    const indexResult = await this.index.execute(kind, run.metadata);
    return { ...run, currentStage: stage, indexed: indexResult.indexed };
  }
}
