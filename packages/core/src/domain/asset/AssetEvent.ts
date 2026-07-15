export interface AssetRegisteredEvent {
  readonly eventType: 'AssetRegistered';
  readonly assetId: string;
  readonly projectId: string;
  readonly type: string;
  readonly uri: string;
  readonly occurredAt: Date;
}

export interface AssetRetiredEvent {
  readonly eventType: 'AssetRetired';
  readonly assetId: string;
  readonly occurredAt: Date;
}

export type AssetEvent = AssetRegisteredEvent | AssetRetiredEvent;
