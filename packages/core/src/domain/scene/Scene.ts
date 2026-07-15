export type SceneId = string;
export interface SceneProps { readonly id: SceneId; readonly name: string; readonly order: number; }
export class Scene { readonly id: SceneId; readonly name: string; readonly order: number; constructor(props: SceneProps) { this.id = props.id; this.name = props.name; this.order = props.order; } }
