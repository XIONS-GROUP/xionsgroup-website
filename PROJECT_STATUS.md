# XIONS GROUP — 当前项目状态

更新：2026-09-23。历史在[项目日志](docs/project-log/README.md)，结构在[Map](docs/project-map.md)。

## 分支与运行

- 根目录是唯一运行/部署入口；Astro静态输出dist。
- dev：法英完整多页站。已推送提交 532f20d（导航反色、集团页居中、Press重排、文案核查）。更早：acddfc3、1a491c4、a25dd52。
- 仓库位置已从 Documents/Xionsgroup 移到 **Developer/web-build/Xionsgroup**；node_modules 未随迁，换机需重新 npm ci。
- main：**已更新为 X 动画占位页**（提交 1814787，2026-09-23 推送）。仅移植 HeroLight 组件与其脚本/配置，未合并 dev 的任何站点内容；仍 noindex。Netlify 实际部署未验证。
- GitHub：XIONS-GROUP/xionsgroup-website；预览 https://dev--xionsgroup.netlify.app；主域配置 https://www.xionsgroup.com。
- Netlify：根目录 npm run build → dist；推送触发构建，部署成功需另验。
- 用户曾确认域名连通，09-21又提供Pending DNS/SSL提示。本轮未重查远端DNS、证书或队列；旧“DNS/TLS已正常”已撤下。

## 已实现（源码/历史提交可核对）

- 集团、四品牌共享模板、Press、承诺、招聘、联系、成功页、四法律页及404。
- 17路由/语言、30公开sitemap URL；法英正文/表单/法律/alt/metadata；无运行时翻译API。
- 两个桌面下拉共用磨砂面；手机全屏抽屉，集团不展开团队，品牌显示四家；主导航大写。
- 首页四品牌居中Logo卡、六活动标识；品牌官网/Instagram集中维护，Betenoir保持未上线。
- 红色#c20000、SVG箭头、白底图标/分享封面。body仍是近白#fefdfb，导航是白色半透明。
- Netlify Forms分类必填、补充标题可选、成功/错误界面、扫描声明。邮件投递是远端验收项；Resend未启用。
- SEO canonical/hreflang/JSON-LD/robots/sitemap；所有context仍禁索引。
- 图片清单与Illustrator脚本；源src/data/visuals.json，非生产素材预览 /fr/visual-plan/。市场部素材已压缩接入8个槽位；Press与品牌页不再渲染占位线框。

## 当前 Hero / 工具箱

- 手机X **390px**（≤700px），桌面X **650px**，2876:1580比例，中心锁定，窗口裁切。
- 噪点 **12% / 0.9px**；全画面白场、聚合X、180°旋转，**退场是形成的倒放**（沿四臂扩散的旧退场已删除）。
- 六段 **1 / 6 / 1 / 4 / 2 / 6秒 = 20秒**，一轮末帧与首帧相同，循环无缝；旋转角跨轮累加不归零。
- 缓动曲线 `E(t,k)=t^k/(t^k+(1-t)^k)`，入场/退场与旋转分开，**默认 `{formation: 2, rotation: 3}`**（旧五次曲线等效 1.875），工具箱各可调 1–8。入场与退场必须共用同一个值，否则退场不再是形成的严格倒放、首尾衔接会破。
- 宽柔光+弧边细高光**不分阶段、全程不停循环**，强度 **290%**、速度 **0.55×**，跨循环不重置相位。白场阶段呈白底灰X的反色观感，用户已认可。
- 详见[流光循环记录](docs/project-log/2026-09-22-flow-loop.md)、[接缝记录](docs/project-log/2026-09-22-loop-seam.md)与[缓动与版本记录](docs/project-log/2026-09-22-easing-and-presets.md)。
- /design-preview/：380px可收起工具箱、手机/桌面、尺寸/噪点/流光/缓动/时长、时间轴/暂停/重播。可把全部参数存成带名字的版本并一键载入，文件落在 `local-materials/hero-presets/`（不进仓库）。工具箱路由和JS都不进部署产物。
- 配置src/config/hero-light.ts；[技术说明](docs/home-hero-animation.md)；[参数历史](docs/project-log/hero-parameters.md)。
- 摄影Hero两槽仅保留为未来选项，不再算上线必需缺图。

## 发布前剩余事项

1. 确认流光层次、真实手机可读性/性能、键盘和减弱动态体验。白场阶段的反色观感用户已认可，不再是待办。
2. 补齐团队/品牌/Press摄影和图注；审核集团/品牌/英文陈述。
3. 公司确认隐私法律依据：原文仍含勾选同意，而实际表单无勾选框，须同步法英。
4. 授权后用唯一测试标记验收Netlify字段→后台记录→邮箱内容与Reply-To；成功页单独通过不够。
5. Netlify插件/CLI复查dev部署、DNS/TLS、www跳转、真实404；用户明确避免Computer Use排查Netlify。
6. 单独处理依赖安全升级并回归，不在视觉微调中顺带大版本升级。
7. 审核dev→main发布；仅生产启索引；Search Console验证/提交sitemap，发布后观察抓取/性能，尚未执行。
8. 持续维护内容/外链、图片体积/alt、表单、证书/部署、依赖；CMS按需另定。
9. ~~统一尾斜杠链接~~ **已完成**（提交 a25dd52）：源码 39 处链接补齐尾斜杠，构建产物中无尾斜杠内链由 24 处降为 0，12 条法英路由实测全部 200。

## 本轮已验证

构建通过；38个HTML内部链接与34个双语页面检查通过；Astro 48文件0错误/警告；`npx tsc --noEmit` 无输出。缓动在 power 1 / 2.5 / 5 / 8 下接缝处装配进度与旋转角全部连续，形成与退场镜像时刻装配进度差 < 1e-12，旋转峰值角速度 45 / 112.5 / 225 / 359.8 °/s 与理论斜率吻合。预设端点实测空目录、路径穿越消毒、保存/列出/载入完整走通。构建后grep确认 `dist` 已无工具箱JS与dev端点字符串。`/design-preview/` 清空本地存储后读到20秒 / 1-6-1-4-2-6 / 缓动3.0 / 290% / 0.55×。尚未做实体手机GPU验收或远端部署验证。

## 市场部素材

14 张原片已压到网站尺寸并按命名规范放进 `public/images/`，接入 8 个槽位。用户已把原片目录 `public/XIONS/` 与 29MB 的 Illustrator 源文件移出 `public/`，构建产物随之回到 5.7MB（此前被撑到 178MB）。

`public/images` 现为 4.3MB：两张遗留 PNG 主图已转 JPEG（3.1MB→145KB、3.2MB→321KB）。仍未使用的素材：戛纳红毯第二张、名人手持产品。

## 已有工作保护

工作区另有之前的邮件原型及package脚本改动，见[交接日志](docs/project-log/README.md)。不激活、不删除、不混入其他发布。旧方案保留docs/archive/。Graphify已找到的图属于L’Entropiste，本项目Map独立整理。
