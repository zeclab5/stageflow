import { AssetRepository } from '../../domain/asset/Asset';
import { RegisterAsset, RetireAsset } from '../command/AssetCommand';
import { ListAssets } from '../query/AssetQuery';
import { AssetType } from '../../domain/asset/Asset';

const VALID_ASSET_TYPES = new Set<AssetType>(['image', 'video', 'audio', 'text']);

function assertAssetType(value: string): AssetType {
  if (!VALID_ASSET_TYPES.has(value as AssetType)) {
    throw new Error(`invalid asset type: ${value}`);
  }
  return value as AssetType;
}

export class AssetService {
  constructor(private readonly repo: AssetRepository) {}

  async register(projectId: string, type: string, name: string, uri: string, description?: string, tags?: string[], size?: number) {
    return new RegisterAsset(this.repo).execute(projectId, name, assertAssetType(type), uri, description, tags, size);
  }

  async retire(id: string) {
    return new RetireAsset(this.repo).execute(id);
  }

  async listByProject(projectId: string) {
    return new ListAssets(this.repo).execute(projectId);
  }
}
