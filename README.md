# XIONS GROUP website

XIONS GROUP 集团官网：Astro 静态多页网站，法语 / 英语共享模板；整体为简约社论设计，首页使用黑白 X 程序动画。它不是 Shopify 主题，当前没有 CMS。

**新窗口/新同事请先读[项目日志入口](docs/project-log/README.md)，再读[当前状态](PROJECT_STATUS.md)和[网站与代码 Map](docs/project-map.md)。** 历史需求、实施原因、参数变化与未完成事项集中在日志里，不要仅依赖旧聊天或归档方案。

## 项目如何发展到现在

| 阶段 | 内容 |
| --- | --- |
| 09-12—09-13 · 基础链路 | 公司资产归属、Astro、GitHub dev/main、Netlify预览/生产、GoDaddy DNS；根目录统一、旧代码归档 |
| 09-13—09-15 · 页面与设计 | 集团/四品牌/Press/承诺/招聘/联系/法律页面；共享模板；极简导航、原文与公司资料补全、SVG箭头 |
| 09-16—09-17 · 视觉与表单 | 图片位置/尺寸/命名、Illustrator画板脚本、活动Logo/图库、磨砂抽屉导航、表单/成功页、品牌外链 |
| 09-21 · 双语与SEO | 全站英文、法英切换、SEO元数据/结构化数据/分享封面、英文路由重定向修复 |
| 09-22 · 动效与交接 | 固定比例X、白场形成、180°旋转、三阶段持续流光、设计工具箱；确认390/650px与15秒，集中整理日志 |

详细记录：[需求与实施时间线](docs/project-log/2026-09-12-to-22.md) · [Hero参数历史](docs/project-log/hero-parameters.md) · [Git历史](docs/project-log/git-history.md)。

## 当前确认值

手机X **390px**；桌面X **650px**；固定2876:1580比例、中心锁定、窗口裁切；噪点12% / 0.9px。六段时长 **0 / 5 / 0 / 4 / 1 / 5秒**，共15秒。宽柔光与细弧边高光连续覆盖旋转前/旋转/旋转后三阶段。唯一参数来源：[hero-light.ts](src/config/hero-light.ts)。

## 本地运行

从仓库根目录运行，Node版本见 .nvmrc：

~~~sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4323
npm run build
npm run astro -- check
~~~

[打开本地设计工具箱](http://127.0.0.1:4323/design-preview/)。法文 /fr/、英文 /en/。npm run preview 预览构建产物；工具箱只在本地开发服务存在。工具箱试值不是源码默认值，确认后再写入配置。不要因端口占用不断启动新的服务。

## 文件与内容维护

- src/pages/fr/、src/components/：实际页面/共享模板；品牌数据在 src/data/brands.ts。
- src/i18n/：英文/法律翻译和路由对应；改法文需同步英文。详见[双语与SEO](docs/bilingual-seo.md)。
- src/data/visuals.json：视觉位置、文件名、尺寸；上线图片在 public/images/。
- local-materials/：忽略的公司原件和制作输出；原文在 local-materials/content/xions-group-web-text-corrected.txt。
- content/home.fr.json：历史文案资料，当前首页不直接读取；改首页看 HomePage.astro。
- docs/project-log/：统一日志；docs/project-map.md：当前地图；docs/archive/：旧方案。
- archive/：旧实现，不部署。

Graphify原地图属于L’Entropiste Shopify项目；本仓库Map已独立核对，详见Map来源说明。

## 发布与交接

本地 → GitHub dev → Netlify分支预览 → 验收 → dev合并main → Netlify生产。

仓库：XIONS-GROUP/xionsgroup-website；[dev预览](https://dev--xionsgroup.netlify.app)；[正式域名](https://www.xionsgroup.com)。main目前仍是预热占位页。Netlify从根目录执行 npm run build，发布 dist。推送只触发构建，不等同部署成功；远端DNS/TLS发布时重新核对。本轮先保留本地修改。

预览禁索引；正式发布确认后才将 netlify.toml 的 production context 中 ALLOW_INDEXING 设为 true，其他context保持false。Netlify Forms成功页与邮件投递分开验收；未启用Resend原型。

每次接手先看 git status，保留已有工作。每次实质变更追加日志，更新状态/参数文档。阅读 [PROJECT_RULES](PROJECT_RULES.md)；不强推、不擅自合并main、不改公司邮件DNS。Netlify优先插件/CLI，避免不必要Computer Use。
