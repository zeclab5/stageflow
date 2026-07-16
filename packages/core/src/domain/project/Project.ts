export type ProjectId = string;
export type ProjectName = string;
export type ProjectStatus = 'draft' | 'active' | 'closed';

import { ProjectClosedEvent } from './ProjectEvent';

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

  close(): ProjectClosedEvent {
    if (this.status === 'closed') {
      throw new Error('Project is already closed');
    }
    return {
      eventType: 'ProjectClosed',
      projectId: this.id,
      occurredAt: new Date(),
    } as ProjectClosedEvent;
  }
}
