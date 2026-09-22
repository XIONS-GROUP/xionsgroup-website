# XIONS GROUP — 当前项目状态

更新：2026-09-22。历史在[项目日志](docs/project-log/README.md)，结构在[Map](docs/project-map.md)。

## 分支与运行

- 根目录是唯一运行/部署入口；Astro静态输出dist。
- dev：法英完整多页站。已推送提交 2493143（退场改为开场倒放、25秒时长、流光0.55×）。上两个实现提交 b5ee5a5（流光全程循环）、ba6eae3（390/650px与文档整理）。
- 本地main / 已知origin/main：9b56a72预热Logo占位页。本轮未fetch，不把快照当实时云端状态。
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
- 图片清单与Illustrator脚本；源src/data/visuals.json，非生产素材预览 /fr/visual-plan/。

## 当前 Hero / 工具箱

- 手机X **390px**（≤700px），桌面X **650px**，2876:1580比例，中心锁定，窗口裁切。
- 噪点 **12% / 0.9px**；全画面白场、聚合X、180°旋转，**退场是形成的倒放**（沿四臂扩散的旧退场已删除）。
- 六段 **2 / 10 / 2 / 4 / 2 / 5秒 = 25秒**，一轮末帧与首帧相同，循环无缝；旋转角跨轮累加不归零。
- 宽柔光+弧边细高光**不分阶段、全程不停循环**，强度 **290%**、速度 **0.55×**，跨循环不重置相位。白场阶段呈白底灰X的反色观感，用户已认可。
- 详见[流光循环记录](docs/project-log/2026-09-22-flow-loop.md)与[接缝记录](docs/project-log/2026-09-22-loop-seam.md)。
- /design-preview/：380px可收起工具箱、手机/桌面、尺寸/噪点/时长、时间轴/暂停/重播；不进部署产物。
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
9. 统一尾斜杠链接：本轮观察到本地 /fr 返回404、/fr/ 正常；现有部分法文链接无尾斜杠。核对Astro本地和Netlify重定向，避免仅依赖线上自动补全。

## 本轮已验证

构建通过；38个HTML内部链接与34个双语页面检查通过；Astro 48文件0错误/警告。接缝验证：`heroFrame` 纯函数在第0→1轮与第1→2轮接缝处，装配进度、旋转角和流光时钟三项全部连续；浏览器实际播放跨接缝确认装配进度平滑落到0、角度保持180°不回弹、流光时钟24.82→25.48单调。逐帧对照 t=7 与镜像时刻 t=22.5 结构一致，t=24.9 已回到与 t=0 相同的白场反色状态。`/design-preview/` 清空本地存储后读到25秒 / 290% / 0.55× 默认值。尚未做实体手机GPU验收或远端部署验证。

## 已有工作保护

工作区另有之前的邮件原型及package脚本改动，见[交接日志](docs/project-log/README.md)。不激活、不删除、不混入其他发布。旧方案保留docs/archive/。Graphify已找到的图属于L’Entropiste，本项目Map独立整理。
