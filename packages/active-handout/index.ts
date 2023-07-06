import mdx from '@astrojs/mdx';
import type {
  AstroIntegration,
  AstroUserConfig,
  ViteUserConfig,
} from 'astro';
import { ActiveHandoutConfig, ActiveHandoutConfigSchema, ActiveHandoutUserConfig } from './utils/user-config';
import { errorMap } from './utils/error-map';

export default function ActiveHandoutIntegration(opts: ActiveHandoutUserConfig): AstroIntegration[] {
  const parsedConfig = ActiveHandoutConfigSchema.safeParse(opts, { errorMap });
  
  if (!parsedConfig.success) {
    throw new Error(
      'Invalid config passed to active-handout integration\n' +
        parsedConfig.error.issues.map((i) => i.message).join('\n')
    );
  }

  const userConfig = parsedConfig.data;

  const ActiveHandout: AstroIntegration = {
    name: '@insperedu/active-handout',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        injectRoute({
          pattern: '404',
          entryPoint: '@insperedu/active-handout/404.astro',
        });
        injectRoute({
          pattern: '[...slug]',
          entryPoint: '@insperedu/active-handout/index.astro',
        });
        const newConfig: AstroUserConfig = {
          vite: {
            plugins: [vitePluginActiveHandoutUserConfig(userConfig)],
            ssr: {
              noExternal: ['@fontsource-variable/open-sans', '@fontsource-variable/oswald', '@fontsource/fira-mono'],
            }
          },
          experimental: { assets: true },
        };
        updateConfig(newConfig);
      },
    },
  };

  return [ActiveHandout, mdx()];
}

function resolveVirtualModuleId(id: string) {
  return '\0' + id;
}

/** Expose the Active Handout user config object via a virtual module. */
function vitePluginActiveHandoutUserConfig(opts: ActiveHandoutConfig): NonNullable<ViteUserConfig['plugins']>[number] {
  const modules = {
    'virtual:active-handout/user-config': `export default ${JSON.stringify(opts)}`,
  };
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: 'vite-plugin-active-handout-user-config',
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id);
    },
    load(id): string | void {
      const resolution = resolutionMap[id];
      if (resolution) return modules[resolution];
    },
  };
}