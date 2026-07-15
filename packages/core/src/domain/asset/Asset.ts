export type AssetId = string;
export type AssetType = 'image' | 'video' | 'audio' | 'text';
export interface AssetProps { readonly id: AssetId; readonly type: AssetType; readonly uri: string; }
export class Asset { readonly id: AssetId; readonly type: AssetType; readonly uri: string; constructor(props: AssetProps) { this.id = props.id; this.type = props.type; this.uri = props.uri; } }
