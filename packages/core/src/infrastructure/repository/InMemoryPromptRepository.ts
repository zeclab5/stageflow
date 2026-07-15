import { Prompt, PromptId, PromptRepository } from '../../domain/prompt/PromptRepository';

export class InMemoryPromptRepository implements PromptRepository {
  private readonly items = new Map<PromptId, Prompt>();

  async findById(id: PromptId): Promise<Prompt | null> {
    return this.items.get(id) ?? null;
  }

  async save(prompt: Prompt): Promise<void> {
    this.items.set(prompt.id, prompt);
  }
}
