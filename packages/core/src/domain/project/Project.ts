export type ProjectId = string;
export type ProjectName = string;
export type ProjectStatus = 'draft' | 'active' | 'closed';

export interface ProjectProps {
  readonly id: ProjectId;
  readonly name: ProjectName;
  readonly status: ProjectStatus;
}

export class Project {
  readonly id: ProjectId;
  readonly name: ProjectName;
  readonly status: ProjectStatus;

  constructor(props: ProjectProps) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
  }
}
