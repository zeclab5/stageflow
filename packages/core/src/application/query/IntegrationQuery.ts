import { IntegrationProfile, IntegrationRepository, IntegrationId } from '../../domain/integration/IntegrationProfile';

export class GetIntegration {
  constructor(private readonly repo: IntegrationRepository) {}

  async execute(id: IntegrationId) {
    const integration = await this.repo.findById(id);
    if (!integration) throw new Error('integration not found');
    return integration;
  }
}

export class ListIntegrations {
  constructor(private readonly repo: IntegrationRepository) {}

  async execute(): Promise<IntegrationProfile[]> {
    return [];
  }
}
