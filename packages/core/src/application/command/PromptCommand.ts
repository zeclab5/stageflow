import { Prompt, PromptId, PromptVariables, PromptRepository, ProjectId } from '../../domain/prompt/PromptRepository';

export class CreatePrompt {
  constructor(private readonly repo: PromptRepository) {}

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
    return prompt;
  }
}

export class UpdatePromptTemplate {
  constructor(private readonly repo: PromptRepository) {}

  async execute(id: PromptId, template: string): Promise<Prompt> {
    const prompt = await this.repo.findById(id);
    if (!prompt) throw new Error('prompt not found');
    if (!template || !template.trim()) throw new Error('prompt template is required');

    const updated = prompt.withTemplate(template.trim());
    await this.repo.save(updated);
    return updated;
  }
}

export class UpdatePromptVariables {
  constructor(private readonly repo: PromptRepository) {}

  async execute(id: PromptId, variables: PromptVariables): Promise<Prompt> {
    const prompt = await this.repo.findById(id);
    if (!prompt) throw new Error('prompt not found');

    const updated = prompt.withVariables(variables);
    await this.repo.save(updated);
    return updated;
  }
}
