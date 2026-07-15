import { IntegrationRepository } from '../../domain/integration/IntegrationProfile';
import { CreateIntegrationProfile, ActivateIntegration, SuspendIntegration } from '../command/IntegrationCommand';
import { GetIntegration, ListIntegrations } from '../query/IntegrationQuery';

export class IntegrationService {
  constructor(private readonly repo: IntegrationRepository) {}

  async create(name: string, type: string, config: Record<string, string>) {
    return new CreateIntegrationProfile(this.repo).execute(name, type, config);
  }

  async activate(id: string) {
    return new ActivateIntegration(this.repo).execute(id);
  }

  async suspend(id: string) {
    return new SuspendIntegration(this.repo).execute(id);
  }

  async get(id: string) {
    return new GetIntegration(this.repo).execute(id);
  }

  async list() {
    return new ListIntegrations(this.repo).execute();
  }
}
