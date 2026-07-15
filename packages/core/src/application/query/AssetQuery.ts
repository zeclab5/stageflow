import { Asset, AssetRepository } from '../../domain/asset/Asset';

export class ListAssets {
  constructor(private readonly repo: AssetRepository) {}

  async execute(projectId: string): Promise<Asset[]> {
    void projectId;
    return [];
  }
}
