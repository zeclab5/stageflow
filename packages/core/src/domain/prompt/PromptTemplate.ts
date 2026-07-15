export type PromptId = string;
export type ProjectId = string;
export type PromptTemplate = string;
export type PromptVariables = Record<string, string>;

export interface PromptProps {
  readonly id: PromptId;
  readonly projectId: ProjectId;
  readonly template: PromptTemplate;
  readonly variables: PromptVariables;
  readonly version: number;
}

export class Prompt {
  readonly id: PromptId;
  readonly projectId: ProjectId;
  readonly template: PromptTemplate;
  readonly variables: PromptVariables;
  readonly version: number;

  constructor(props: PromptProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.template = props.template;
    this.variables = props.variables;
    this.version = props.version;
  }

  withTemplate(template: PromptTemplate) {
    return new Prompt({
      id: this.id,
      projectId: this.projectId,
      template,
      variables: this.variables,
      version: this.version + 1
    });
  }

  withVariables(variables: PromptVariables) {
    return new Prompt({
      id: this.id,
      projectId: this.projectId,
      template: this.template,
      variables,
      version: this.version + 1
    });
  }
}
