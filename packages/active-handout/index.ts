import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import emoji from "remark-emoji";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import AutoImport from "astro-auto-import";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import linkIcon from "./utils/hastSVGLinkIcon";
import type { AstroIntegration, AstroUserConfig, ViteUserConfig } from "astro";
import {
  type ActiveHandoutConfig,
  ActiveHandoutConfigSchema,
  type ActiveHandoutUserConfig,
} from "./utils/user-config";
import { errorMap } from "./utils/error-map";
import { remarkInlinePrism } from "./remark/remark-inline-prism";

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
          entrypoint: "@toshikurauchi/active-handout/pages/404.astro",
        });
        injectRoute({
          pattern: "[...slug]",
          entrypoint: "@toshikurauchi/active-handout/pages/index.astro",
        });

        if (userConfig.auth) {
          injectRoute({
            pattern: "api/auth/signin",
            entrypoint:
              "@toshikurauchi/active-handout/pages/api/auth/signin.ts",
          });
          injectRoute({
            pattern: "api/auth/signout",
            entrypoint:
              "@toshikurauchi/active-handout/pages/api/auth/signout.ts",
          });
          injectRoute({
            pattern: "api/auth/register",
            entrypoint:
              "@toshikurauchi/active-handout/pages/api/auth/register.ts",
          });
          injectRoute({
            pattern: "api/auth/profile",
            entrypoint:
              "@toshikurauchi/active-handout/pages/api/auth/profile.ts",
          });
          injectRoute({
            pattern: "register",
            entrypoint: "@toshikurauchi/active-handout/pages/register.astro",
          });
          injectRoute({
            pattern: "signin",
            entrypoint: "@toshikurauchi/active-handout/pages/signin.astro",
          });
          injectRoute({
            pattern: "profile",
            entrypoint: "@toshikurauchi/active-handout/pages/profile.astro",
          });

          if (userConfig.telemetry) {
            injectRoute({
              pattern: "api/telemetry",
              entrypoint:
                "@toshikurauchi/active-handout/pages/api/telemetry/index.ts",
            });
            injectRoute({
              pattern: "api/auto-grade/multiple-choice",
              entrypoint:
                "@toshikurauchi/active-handout/pages/api/auto-grade/multiple-choice.ts",
            });
            injectRoute({
              pattern: "api/auto-grade/parsons-problem",
              entrypoint:
                "@toshikurauchi/active-handout/pages/api/auto-grade/parsons-problem.ts",
            });
            injectRoute({
              pattern: "api/auto-grade/text-exercise",
              entrypoint:
                "@toshikurauchi/active-handout/pages/api/auto-grade/text-exercise.ts",
            });
            injectRoute({
              pattern: "api/auto-grade/ai-text-exercise",
              entrypoint:
                "@toshikurauchi/active-handout/pages/api/auto-grade/ai-text-exercise.ts",
            });
          }
        }

        const newConfig: AstroUserConfig = {
          // Setup auth
          // IMPORTANT: if you are using auth, you must set an adapter in the configurations
          // see more at https://docs.astro.build/en/guides/server-side-rendering/
          output: userConfig.auth ? "server" : "static",

          markdown: {
            syntaxHighlight: "prism",
            remarkPlugins: [remarkInlinePrism, emoji, remarkMath],
            rehypePlugins: [
              rehypeAccessibleEmojis,
              rehypeSlug,
              rehypeKatex,
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
            css: {
              preprocessorOptions: {
                scss: {
                  api: "modern",
                }
              }
            },
            plugins: [vitePluginActiveHandoutUserConfig(userConfig)],
            optimizeDeps: {
              exclude: [
                "virtual:active-handout/user-config",
              ],
            },
            ssr: {
              noExternal: [
                "@fontsource-variable/open-sans",
                "@fontsource-source-sans-pro",
                "@fontsource-variable/oswald",
                "@fontsource/fira-mono",
              ],
            },
          },
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
        "@toshikurauchi/active-handout/components/sidenote/Sidenote.tsx",
        "@toshikurauchi/active-handout/components/sidenote/SidenoteAnchor.tsx",
        "@toshikurauchi/active-handout/components/terminal/Terminal.astro",
        "@toshikurauchi/active-handout/components/terminal/TerminalLine.astro",
        "@toshikurauchi/active-handout/components/exercise/parsons/Parsons.astro",
        "@toshikurauchi/active-handout/components/exercise/parsons/ParsonsLine.astro",
        "@toshikurauchi/active-handout/components/exercise/text-exercise/TextExercise.astro",
        "@toshikurauchi/active-handout/components/exercise/text-exercise/ai-text-exercise/AITextExercise.astro",
        "@toshikurauchi/active-handout/components/exercise/answer/Answer.astro",
        "@toshikurauchi/active-handout/components/exercise/progress-exercise/ProgressExercise.astro",
        "@toshikurauchi/active-handout/components/exercise/multiple-choice/MultipleChoice.astro",
        "@toshikurauchi/active-handout/components/exercise/multiple-choice/Option.astro",
        "@toshikurauchi/active-handout/components/pdf-viewer/PDFViewer.astro",
        "@toshikurauchi/active-handout/components/tabs/TabGroup.astro",
        "@toshikurauchi/active-handout/components/tabs/TabItem.astro",
        "@toshikurauchi/active-handout/components/video/Video.astro",
        "@toshikurauchi/active-handout/components/slides/Slides.astro",
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
