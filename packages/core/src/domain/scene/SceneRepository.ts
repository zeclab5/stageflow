export type SceneId = string;
export type ProjectId = string;
export interface SceneProps { readonly id: SceneId; readonly projectId: ProjectId; readonly name: string; readonly order: number; }
export class Scene { readonly id: SceneId; readonly projectId: ProjectId; readonly name: string; readonly order: number; constructor(props: SceneProps) { this.id = props.id; this.projectId = props.projectId; this.name = props.name; this.order = props.order; } }
export interface SceneRepository { findById(id: SceneId): Promise<Scene | null>; save(scene: Scene): Promise<void>; }
