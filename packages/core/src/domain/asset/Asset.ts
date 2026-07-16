export type AssetId = string;
export type ProjectId = string;
export type AssetType = 'image' | 'video' | 'audio' | 'text';
export interface AssetProps { readonly id: AssetId; readonly projectId: ProjectId; readonly name: string; readonly type: AssetType; readonly uri: string; readonly description?: string; readonly tags?: string[]; readonly size?: number; }
export class Asset { readonly id: AssetId; readonly projectId: ProjectId; readonly name: string; readonly type: AssetType; readonly uri: string; readonly description?: string; readonly tags?: string[]; readonly size?: number; constructor(props: AssetProps) { this.id = props.id; this.projectId = props.projectId; this.name = props.name; this.type = props.type; this.uri = props.uri; this.description = props.description; this.tags = props.tags; this.size = props.size; } }
export interface AssetRepository { findById(id: AssetId): Promise<Asset | null>; save(asset: Asset): Promise<void>; delete(id: AssetId): Promise<void>; listByProject(projectId: ProjectId): Promise<Asset[]>; }
