export interface CreateProject { name: string; }
export interface UpdateProject { id: string; patch: Partial<{ name: string; status: string }>; }
