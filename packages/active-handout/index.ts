import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import emoji from "remark-emoji";
import path from "path";
import { fileURLToPath } from "url";
import { viteStaticCopy } from "vite-plugin-static-copy";
import rehypeSlug from "rehype-slug";
import AutoImport from "astro-auto-import";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import linkIcon from "./utils/hastSVGLinkIcon";
import type { AstroIntegration, AstroUserConfig, ViteUserConfig } from "astro";
import {
  ActiveHandoutConfig,
  ActiveHandoutConfigSchema,
  ActiveHandoutUserConfig,
} from "./utils/user-config";
import { errorMap } from "./utils/error-map";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function ActiveHandoutIntegration(
  opts: ActiveHandoutUserConfig
): AstroIntegration[] {
  const parsedConfig = ActiveHandoutConfigSchema.safeParse(opts, { errorMap });

  if (!parsedConfig.success) {
    throw new Error(
      "Invalid config passed to active-handout integration\n" +
        parsedConfig.error.issues.map((i) => i.message).join("\n")
    );
  }

  const userConfig = parsedConfig.data;

  const ActiveHandout: AstroIntegration = {
    name: "@toshikurauchi/active-handout",
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig }) => {
        injectRoute({
          pattern: "404",
          entryPoint: "@toshikurauchi/active-handout/pages/404.astro",
        });
        injectRoute({
          pattern: "[...slug]",
          entryPoint: "@toshikurauchi/active-handout/pages/index.astro",
        });
        if (userConfig.auth) {
          injectRoute({
            pattern: "api/auth/signin",
            entryPoint:
              "@toshikurauchi/active-handout/pages/api/auth/signin.ts",
          });
          injectRoute({
            pattern: "api/auth/signout",
            entryPoint:
              "@toshikurauchi/active-handout/pages/api/auth/signout.ts",
          });
          injectRoute({
            pattern: "api/auth/register",
            entryPoint:
              "@toshikurauchi/active-handout/pages/api/auth/register.ts",
          });
          injectRoute({
            pattern: "register",
            entryPoint: "@toshikurauchi/active-handout/pages/register.astro",
          });
          injectRoute({
            pattern: "signin",
            entryPoint: "@toshikurauchi/active-handout/pages/signin.astro",
          });
        }
        const newConfig: AstroUserConfig = {
          // Setup auth
          // IMPORTANT: if you are using auth, you must set an adapter in the configurations
          // see more at https://docs.astro.build/en/guides/server-side-rendering/
          output: userConfig.auth ? "server" : "static",

          markdown: {
            syntaxHighlight: "prism",
            remarkPlugins: [emoji],
            rehypePlugins: [
              rehypeAccessibleEmojis,
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  content() {
                    return [linkIcon];
                  },
                },
              ],
            ],
          },
          vite: {
            plugins: [
              viteStaticCopy({
                targets: [
                  {
                    src: path.resolve(__dirname, "./public/*"),
                    dest: "",
                    overwrite: false,
                  },
                ],
              }),
              vitePluginActiveHandoutUserConfig(userConfig),
            ],
            ssr: {
              noExternal: [
                "@fontsource-variable/open-sans",
                "@fontsource-variable/oswald",
                "@fontsource/fira-mono",
              ],
            },
          },
          experimental: { assets: true },
        };
        updateConfig(newConfig);
      },
    },
  };

  return [
    ActiveHandout,
    AutoImport({
      // Add the components we want to be auto-imported in .mdx files here
      imports: [
        "@toshikurauchi/active-handout/components/admonition/Admonition.astro",
        "@toshikurauchi/active-handout/components/tabs/TabGroup.astro",
        "@toshikurauchi/active-handout/components/tabs/TabItem.astro",
        "@toshikurauchi/active-handout/components/exercise/progress-exercise/ProgressExercise.astro",
      ],
    }),
    react(),
    mdx(),
  ];
}

function resolveVirtualModuleId(id: string) {
  return "\0" + id;
}

/** Expose the Active Handout user config object via a virtual module. */
function vitePluginActiveHandoutUserConfig(
  opts: ActiveHandoutConfig
): NonNullable<ViteUserConfig["plugins"]>[number] {
  const modules = {
    "virtual:active-handout/user-config": `export default ${JSON.stringify(
      opts
    )}`,
  };
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: "vite-plugin-active-handout-user-config",
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id);
    },
    load(id): string | void {
      const resolution = resolutionMap[id];
      if (resolution) return modules[resolution];
    },
  };
}
