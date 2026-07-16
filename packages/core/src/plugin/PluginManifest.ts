export interface PluginManifestSchema {
  readonly entry: string;
  readonly module?: string;
  readonly types?: string;
  readonly category?: 'integration' | 'generation' | 'storage' | 'ui';
}

export type PluginPackageJson = {
  readonly name: string;
  readonly version?: string;
  readonly description?: string;
  readonly stageflowPlugin?: Partial<PluginManifestSchema>;
};
