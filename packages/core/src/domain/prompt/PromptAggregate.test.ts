import { Prompt } from './Prompt';

describe('Prompt Aggregate', () => {
  test('creates prompt matching PromptProps', () => {
    const prompt = new Prompt({ id: 'pr1', template: 'scene: {name}', version: 1 });
    expect(prompt.id).toBe('pr1');
    expect(prompt.template).toBe('scene: {name}');
    expect(prompt.version).toBe(1);
  });
});
