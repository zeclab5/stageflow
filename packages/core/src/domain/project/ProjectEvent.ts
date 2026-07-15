export type ProjectEventType = 'created' | 'updated' | 'closed';
export interface ProjectEvent { readonly type: ProjectEventType; readonly projectId: string; readonly occurredAt: Date; }
