export type IntegrationId = string;
export type ConnectionStatus = 'connected' | 'disconnected';
export interface IntegrationProfileProps { readonly id: IntegrationId; readonly plugin: string; readonly status: ConnectionStatus; }
export class IntegrationProfile { readonly id: IntegrationId; readonly plugin: string; readonly status: ConnectionStatus; constructor(props: IntegrationProfileProps) { this.id = props.id; this.plugin = props.plugin; this.status = props.status; } }
