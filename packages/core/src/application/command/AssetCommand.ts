import { Asset, AssetId, ProjectId, AssetType, AssetRepository } from '../../domain/asset/Asset';
import { EventBus } from '../../infrastructure/event/EventBus';
import { AssetRegisteredEvent, AssetRetiredEvent } from '../../domain/asset/AssetEvent';

export class RegisterAsset {
  constructor(
    private readonly repo: AssetRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: ProjectId, name: string, type: AssetType, uri: string, description?: string, tags?: string[], size?: number): Promise<Asset> {
    const asset = new Asset({
      id: crypto.randomUUID(),
      projectId,
      name,
      type,
      uri,
      description,
      tags,
      size
    });
    await this.repo.save(asset);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'AssetRegistered',
        assetId: asset.id,
        projectId: asset.projectId,
        type: asset.type,
        uri: asset.uri,
        occurredAt: new Date()
      } as AssetRegisteredEvent);
    }

    return asset;
  }
}

export class RetireAsset {
  constructor(
    private readonly repo: AssetRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: AssetId): Promise<void> {
    const asset = await this.repo.findById(id);
    if (!asset) throw new Error('asset not found');
    await this.repo.delete(id);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'AssetRetired',
        assetId: id,
        occurredAt: new Date()
      } as AssetRetiredEvent);
    }
  }
}
