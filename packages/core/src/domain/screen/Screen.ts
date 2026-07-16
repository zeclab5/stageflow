export type ScreenId = string;
export type ProjectId = string;
export type ScreenType = 'Projection' | 'LED' | 'Monitor' | 'NDI' | 'Virtual';

export interface Resolution {
  readonly width: number;
  readonly height: number;
}

export interface ScreenProps {
  readonly id: ScreenId;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly type: ScreenType;
  readonly resolution: Resolution;
  readonly description?: string;
  readonly enabled: boolean;
  readonly order: number;
}
