import type { ScreenId, ProjectId, ScreenType, Resolution, ScreenProps } from './Screen';

export type { ScreenId, ProjectId, ScreenType, Resolution, ScreenProps };

export interface ScreenRepository {
  findById(id: ScreenId): Promise<ScreenProps | null>;
  save(screen: ScreenProps): Promise<void>;
  delete(id: ScreenId): Promise<void>;
  listByProject(projectId: ProjectId): Promise<ScreenProps[]>;
}
