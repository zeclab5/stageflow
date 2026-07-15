export type PromptId = string;
export type PromptTemplate = string;
export interface PromptProps { readonly id: PromptId; readonly template: PromptTemplate; readonly version: number; }
export class Prompt { readonly id: PromptId; readonly template: PromptTemplate; readonly version: number; constructor(props: PromptProps) { this.id = props.id; this.template = props.template; this.version = props.version; } }
