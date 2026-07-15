export type AssetId = string;
export type ProjectId = string;
export type AssetType = 'image' | 'video' | 'audio' | 'text';
export interface AssetProps { readonly id: AssetId; readonly projectId: ProjectId; readonly type: AssetType; readonly uri: string; }
export class Asset { readonly id: AssetId; readonly projectId: ProjectId; readonly type: AssetType; readonly uri: string; constructor(props: AssetProps) { this.id = props.id; this.projectId = props.projectId; this.type = props.type; this.uri = props.uri; } }
export interface AssetRepository { findById(id: AssetId): Promise<Asset | null>; save(asset: Asset): Promise<void>; }
