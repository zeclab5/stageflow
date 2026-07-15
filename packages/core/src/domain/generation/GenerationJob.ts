export type JobId = string;
export type JobStatus = 'requested' | 'completed' | 'failed';
export interface GenerationJobProps { readonly id: JobId; readonly providerRef: string; readonly status: JobStatus; }
export class GenerationJob { readonly id: JobId; readonly providerRef: string; readonly status: JobStatus; constructor(props: GenerationJobProps) { this.id = props.id; this.providerRef = props.providerRef; this.status = props.status; } }
