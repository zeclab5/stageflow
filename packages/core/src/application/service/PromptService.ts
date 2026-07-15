import { PromptRepository } from '../../domain/prompt/PromptRepository';
import { CreatePrompt, UpdatePromptTemplate } from '../command/PromptCommand';
import { ListPrompts } from '../query/PromptQuery';

export class PromptService {
  constructor(private readonly repo: PromptRepository) {}

  async create(projectId: string, template: string, variables?: Record<string, string>) {
    return new CreatePrompt(this.repo).execute(projectId, template, variables);
  }

  async updateTemplate(id: string, template: string) {
    return new UpdatePromptTemplate(this.repo).execute(id, template);
  }

  async listByProject(projectId: string) {
    return new ListPrompts(this.repo).execute(projectId);
  }
}
