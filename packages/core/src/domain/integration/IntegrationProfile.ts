export type IntegrationId = string;
export type ConnectionStatus = 'connected' | 'disconnected';

export interface IntegrationProfileProps {
  readonly id: IntegrationId;
  readonly name: string;
  readonly type: string;
  readonly config: Record<string, string>;
  readonly status: ConnectionStatus;
}

export class IntegrationProfile {
  readonly id: IntegrationId;
  readonly name: string;
  readonly type: string;
  readonly config: Record<string, string>;
  readonly status: ConnectionStatus;

  constructor(props: IntegrationProfileProps) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.config = props.config;
    this.status = props.status;
  }
}

export interface IntegrationRepository {
  findById(id: IntegrationId): Promise<IntegrationProfile | null>;
  save(integration: IntegrationProfile): Promise<void>;
}
