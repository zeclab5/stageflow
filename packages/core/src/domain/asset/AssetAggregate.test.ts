import { Asset, AssetType } from './Asset';

describe('Asset Aggregate', () => {
  test('creates asset with id, projectId, type, and uri', () => {
    const asset = new Asset({ id: 'a1', projectId: 'p1', name: 'a1', type: 'IMAGE' as AssetType, uri: 's3://a.jpg' });
    expect(asset.id).toBe('a1');
    expect(asset.projectId).toBe('p1');
    expect(asset.type).toBe('IMAGE');
    expect(asset.uri).toBe('s3://a.jpg');
  });
});
