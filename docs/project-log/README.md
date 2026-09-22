# 项目日志与新窗口交接入口

更新：2026-09-22。此目录集中保存 XIONS GROUP 网站的需求演变、实施记录和参数历史。它是决策日志，不是逐字聊天备份。

## 建议阅读顺序

1. [根 README](../../README.md)：项目背景、发展阶段、运行方式。
2. [当前状态](../../PROJECT_STATUS.md)：现在做到哪里、哪些事情仍未完成。
3. [网站与代码 Map](../project-map.md)：页面、组件、数据和发布链路。
4. [完整需求与实施时间线](2026-09-12-to-22.md)：本次可见会话从项目启动至今的全部主题；同一问题的“继续”并入对应步骤。
5. [Hero 参数历史](hero-parameters.md)：每轮视觉调整及当前确认值。
6. [Git 提交快照](git-history.md)：截至上一实现提交 `406e803` 的完整可达提交记录；此后的变更以 Git 实时日志为准。
7. 按任务查阅 [项目规则](../../PROJECT_RULES.md)、[Hero 技术说明](../home-hero-animation.md)、[双语与 SEO](../bilingual-seo.md)。

## 本次交接

- 当前用户确认：手机 X 390px、桌面 X 650px；白场/形成/旋转前/旋转/旋转后/退场为 **0 / 5 / 0 / 4 / 1 / 5 秒**，合计 15 秒。
- 主体动画已进入参数确认阶段；后续只在明确反馈下继续微调运动细节。
- 用户随后补充并授权：宽柔光与更快细高光连续覆盖完整X的三个阶段；本轮同时实施，形成/退场不叠加，详见参数记录。
- 网站是 Astro 静态站，非 Shopify 主题，无 CMS；`dev` 是完整网站，`main` 仍是待上线占位页。
- 本轮先落实本地参数和文档，不修改域名、邮件后台或生产分支。不能把本地构建通过写成 Netlify 已上线。
- 2026-09-22 检查时另有邮件原型未提交改动：`package.json` 的 `preview:email`、`docs/contact-email-preview.html`、`docs/contact-email-setup.md`、`docs/email-prototype/`、`scripts/render-contact-email-preview.mjs`。属于已有工作，不覆盖、不混入本轮提交。
- 用户提及的 Graphify 原地图属于 **L’Entropiste Shopify** 项目，位于 `/Users/seajelly/Documents/Lentropiste Web/code-map/index.html`；原始 Graphify 数据在同目录 `graphify-native/graphify-out/graph.json`。XIONS 的 [Map](../project-map.md) 是本次依据实际源码整理的 Mermaid 文档，不冒称 Graphify 生成。

## 记录标准

后续每次实质修改，在此目录追加日期记录，并更新 `PROJECT_STATUS.md`。不要用最新状态覆盖过去的决策。每条至少包含：

| 字段 | 写什么 |
| --- | --- |
| 用户需求 | 具体要改什么、为什么 |
| 实施结果 | 文件/功能、是否替代旧方案 |
| 参数 | 旧值 → 新值、单位、适用设备 |
| 证据 | 提交、源码、构建或实际预览结果 |
| 发布状态 | 本地 / 已提交 / 已推送 / 已验证部署，分别记录 |
| 未完成 | 明确待办或需要用户确认的信息 |

历史补记依据：当前会话中的用户请求、现有文档、Git 提交及当前源码。没有证据的操作写“讨论过/待核实”，不推断已完成。旧资料仍留在 `docs/archive/`，通过本日志索引；它们不能覆盖最新需求。

## 新窗口可直接使用的提示

> 请先阅读 README.md、PROJECT_STATUS.md、docs/project-log/README.md、docs/project-map.md 和 PROJECT_RULES.md，再查看与本次任务有关的时间线及 Hero 参数记录。先检查 git status，保留已有改动。当前工作分支为 dev，不自动合并 main。以最新确认参数为准，区分本地预览和远端部署。完成工作后同步更新项目日志与当前状态。
