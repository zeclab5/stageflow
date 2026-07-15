import { Prompt, PromptId, PromptVariables, ProjectId } from './PromptTemplate';

export interface PromptRepository {
  findById(id: PromptId): Promise<Prompt | null>;
  save(prompt: Prompt): Promise<void>;
}

export { Prompt, PromptId, PromptVariables, ProjectId };
