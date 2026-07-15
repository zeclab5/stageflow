import { PromptRepository } from '../../domain/prompt/PromptRepository';

export class ListPrompts {
  constructor(private readonly repo: PromptRepository) {}

  async execute(_projectId: string) {
    void _projectId;
    return [];
  }
}
