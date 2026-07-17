import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const TEMPLATE_ROOT = join(__dirname, '..', '_template');
const PLUGINS_ROOT = join(process.cwd(), 'plugins');

export interface NewPluginOptions {
  readonly name: string;
  readonly category?: 'integration' | 'generation' | 'storage' | 'ui';
  readonly description?: string;
}

export function createPlugin(options: NewPluginOptions): string {
  const slug = options.name.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const target = join(PLUGINS_ROOT, slug);
  if (existsSync(target)) {
    throw new Error(`plugin already exists: ${target}`);
  }
  mkdirSync(join(target, 'src'), { recursive: true });

  const packageJson = {
    name: `@stageflow/${slug}`,
    version: '0.1.0',
    private: true,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    stageflowPlugin: {
      entry: 'dist/index.js',
      module: 'dist/index.js',
      types: 'dist/index.d.ts',
      category: options.category ?? 'integration',
    },
    scripts: {
      build: 'tsc -p tsconfig.json',
      watch: 'tsc -p tsconfig.json --watch',
    },
    dependencies: {
      'stageflow-core': '*',
    },
    description: options.description ?? `StageFlow ${options.name} plugin`,
  };

  const index = `import { Plugin, PluginDescriptor } from 'stageflow-core';\n\nexport class ${capitalize(options.name)}Plugin implements Plugin {\n  readonly name = '${slug}';\n  async init(): Promise<void> {}\n  async shutdown(): Promise<void> {}\n  connect() {\n    return this.name;\n  }\n}\n\nexport const descriptor: PluginDescriptor = {\n  manifest: {\n    name: '${slug}',\n    version: '0.1.0',\n    description: '${options.description ?? options.name + ' plugin'}',\n    category: '${options.category ?? 'integration'}'\n  },\n  create: async () => new ${capitalize(options.name)}Plugin()\n};\n`;

  const tsconfig = `{\n  "extends": "./tsconfig.base.json",\n  "compilerOptions": {\n    "outDir": "./dist",\n    "rootDir": "./src"\n  },\n  "include": ["src/**/*"],\n  "exclude": ["node_modules", "dist"]\n}\n`;

  const tsconfigBase = `{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "commonjs",\n    "lib": ["ES2022", "DOM"],\n    "declaration": true,\n    "strict": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true,\n    "forceConsistentCasingInFileNames": true,\n    "resolveJsonModule": true,\n    "moduleResolution": "node",\n    "downlevelIteration": true\n  }\n}\n`;

  writeFileSync(join(target, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');
  writeFileSync(join(target, 'tsconfig.json'), tsconfig);
  writeFileSync(join(target, 'tsconfig.base.json'), tsconfigBase);
  writeFileSync(join(target, 'src', 'index.ts'), index);

  return target;
}

function capitalize(value: string): string {
  const raw = value.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase());
  if (!raw) return 'Plugin';
  return raw;
}
