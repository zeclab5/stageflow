import { Prompt, PromptId, PromptVariables, PromptRepository, ProjectId } from '../../domain/prompt/PromptRepository';
import { EventBus } from '../../infrastructure/event/EventBus';
import { PromptCreatedEvent, PromptUpdatedEvent } from '../../domain/prompt/PromptEvent';

export class CreatePrompt {
  constructor(
    private readonly repo: PromptRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: ProjectId, template: string, variables?: PromptVariables): Promise<Prompt> {
    if (!template || !template.trim()) {
      throw new Error('prompt template is required');
    }

    const prompt = new Prompt({
      id: crypto.randomUUID(),
      projectId,
      template: template.trim(),
      variables: variables ?? {},
      version: 1
    });

    await this.repo.save(prompt);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'PromptCreated',
        promptId: prompt.id,
        projectId: prompt.projectId,
        occurredAt: new Date()
      } as PromptCreatedEvent);
    }

    return prompt;
  }
}

export class UpdatePromptTemplate {
  constructor(
    private readonly repo: PromptRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: PromptId, template: string): Promise<Prompt> {
    const prompt = await this.repo.findById(id);
    if (!prompt) throw new Error('prompt not found');
    if (!template || !template.trim()) throw new Error('prompt template is required');

    const updated = prompt.withTemplate(template.trim());
    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'PromptUpdated',
        promptId: updated.id,
        template: updated.template,
        occurredAt: new Date()
      } as PromptUpdatedEvent);
    }

    return updated;
  }
}

export class UpdatePromptVariables {
  constructor(
    private readonly repo: PromptRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: PromptId, variables: PromptVariables): Promise<Prompt> {
    const prompt = await this.repo.findById(id);
    if (!prompt) throw new Error('prompt not found');

    const updated = prompt.withVariables(variables);
    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'PromptUpdated',
        promptId: updated.id,
        occurredAt: new Date()
      } as PromptUpdatedEvent);
    }

    return updated;
  }
}
