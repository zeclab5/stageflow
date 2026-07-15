import { Asset, AssetId, ProjectId, AssetType, AssetRepository } from '../../domain/asset/Asset';
import { EventBus } from '../../infrastructure/event/EventBus';
import { AssetRegisteredEvent, AssetRetiredEvent } from '../../domain/asset/AssetEvent';

export class RegisterAsset {
  constructor(
    private readonly repo: AssetRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: ProjectId, type: AssetType, uri: string): Promise<Asset> {
    const asset = new Asset({
      id: crypto.randomUUID(),
      projectId,
      type,
      uri
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

  async execute(id: AssetId): Promise<Asset> {
    const asset = await this.repo.findById(id);
    if (!asset) throw new Error('asset not found');
    const retired = new Asset({ ...asset });
    await this.repo.save(retired);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'AssetRetired',
        assetId: retired.id,
        occurredAt: new Date()
      } as AssetRetiredEvent);
    }

    return retired;
  }
}
