# 项目日志与新窗口交接入口

更新：2026-09-23。此目录集中保存 XIONS GROUP 网站的需求演变、实施记录和参数历史。它是决策日志，不是逐字聊天备份。

## 建议阅读顺序

1. [根 README](../../README.md)：项目背景、发展阶段、运行方式。
2. [当前状态](../../PROJECT_STATUS.md)：现在做到哪里、哪些事情仍未完成。
3. [网站与代码 Map](../project-map.md)：页面、组件、数据和发布链路。
4. [完整需求与实施时间线](2026-09-12-to-22.md)：本次可见会话从项目启动至今的全部主题；同一问题的“继续”并入对应步骤。
5. [2026-09-22 · 流光改为全程循环](2026-09-22-flow-loop.md)：取消流光的阶段门控；替代时间线第 45 条。
6. [2026-09-22 · 退场改为开场倒放](2026-09-22-loop-seam.md)：首尾同帧无缝循环；替代时间线第 9 条的扩散退场。
7. [2026-09-22 · 可调缓动与版本保存](2026-09-22-easing-and-presets.md)：20 秒时长、缓动曲线可调，工具箱可存取本地版本。
8. [2026-09-22 · 首页排版统一与模块重做](2026-09-22-homepage-typography.md)：标题字号统一、奖项去 logo、Notre rôle 重做。
9. [2026-09-22 · 页面内直接改文字](2026-09-22-inline-text-editing.md)：工具箱全局文字编辑、字体字号控制、可双击打开的离线副本。
10. [2026-09-22 · 品牌卡底图、深色段落与滚动动效](2026-09-22-homepage-rhythm-and-motion.md)：打破四段同构、延续 X 语言、全站细微动效。
11. [2026-09-22 · 自助启动预览与全站尾斜杠](2026-09-22-preview-launcher-and-slashes.md)：双击即可开预览；修掉点导航就 404 的问题。
12. [2026-09-22 · 素材接入与页面重排](2026-09-22-assets-and-page-redesign.md)：压缩市场部原片、填充空槽位，重排集团/品牌/Press/Engagements。
13. [2026-09-23 · 导航反色、文案核查与 main 占位页](2026-09-23-nav-copy-audit-and-main-holding.md)：首屏导航透明反色、集团页居中、Press 重排、242 条翻译核查、main 换用 X 动画占位页。
14. [上线前检查](../launch-readiness-2026-09-22.md)：距离上线还缺什么，按阻塞程度排序。
15. [视觉方向备忘 09-17](../visual-direction-2026-09-17.md)：早期的图片与动态优化设想，部分已被后续决定替代。
16. [Hero 参数历史](hero-parameters.md)：每轮视觉调整及当前确认值。
17. [Git 提交快照](git-history.md)：截至上一实现提交 `406e803` 的完整可达提交记录；此后的变更以 Git 实时日志为准。
18. 按任务查阅 [项目规则](../../PROJECT_RULES.md)、[Hero 技术说明](../home-hero-animation.md)、[双语与 SEO](../bilingual-seo.md)。

## 本次交接

- 当前用户确认：手机 X 390px、桌面 X 650px；白场/形成/旋转前/旋转/旋转后/退场为 **1 / 6 / 1 / 4 / 2 / 6 秒**，合计 **20 秒**。
- 缓动曲线可调，入场/退场与旋转分开：默认 `{formation: 2, rotation: 3}`。入场和退场必须共用同一个值，否则首尾衔接会破。
- 工具箱可把全部参数存成版本，落在 `local-materials/hero-presets/`；也能解锁全站文字直接编辑，改动存到 `local-materials/text-edits/`。新窗口接手时先看这两个目录有没有用户调过的值。
- 主体动画已进入参数确认阶段；后续只在明确反馈下继续微调运动细节。
- 流光：**不分阶段，全程不停循环**，强度 290%、速度 0.55×。替代早先“只覆盖完整X三阶段”的方案，详见[流光循环记录](2026-09-22-flow-loop.md)。
- 退场：**X → 白场是「白场 → X」的倒放**，一轮末帧与首帧相同；旋转角跨轮累加不归零，保证接缝处流光不跳位。替代早先“光沿四臂扩散”的退场，详见[接缝记录](2026-09-22-loop-seam.md)。
- 用户已明确认可白场阶段的反色观感（白底上的灰色 X），它不是待修问题。
- 网站是 Astro 静态站，非 Shopify 主题，无 CMS；`dev` 是完整网站；`main` 自 2026-09-23 起是 X 动画占位页（提交 1814787），仍非完整站点。
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
