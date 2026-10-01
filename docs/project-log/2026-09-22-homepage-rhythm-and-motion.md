# 2026-09-22 · 品牌卡底图、深色段落与全站滚动动效

承接[同日首页排版记录](2026-09-22-homepage-typography.md)。上一轮给出的"首页偏空"分析里，用户否决了给首页加活动实拍（第 1 条），采纳第 2、3、4 条，并另外要求给四个品牌 logo 后方加图片。

## 用户需求

1. 首页**不要**活动场景照片。
2. 四个品牌 logo 后方加图片。
3. 打破四段同构（原分析第 2 条）、让 Hero 的 X 语言延续到页面下方（第 3 条）。
4. 全站及各页面模板加入"subtle 但 elegant、干净清爽、高级"的动效，不要多，只增加细节（第 4 条）。

## 实施结果

### 品牌卡底图

[BrandGrid.astro](../../src/components/BrandGrid.astro) 按 `{slug}-hero` 从 `visuals.json` 取图，作为卡片底图铺满，logo 与文字浮在其上。

**素材现状是关键约束**：四个品牌只有两个有实拍图，而且色调正相反——L'Entropiste 是暗红戏剧光，Masqly 是亮黄高调。直接铺满会让四张卡彻底失衡。因此底图默认只有 **9% 不透明度**，静止时四张卡观感接近统一的浅色纸面；hover 时升到 **26%** 并从 `scale(1.02)` 收到 `scale(1)`，照片才真正显形。这样既满足"logo 后方有图"，又不破坏极简基调，同时兼作交互细节。

未提供图片的卡片不渲染底图层，保持原样。

### 深色段落 + X 延续（第 2、3 条合并解决）

把 `Présence internationale` 整段改为深色（`#0b0b0b`，文字 `#f4f1ec`）。页面纵向节奏因此变成 **深(Hero) → 白(vision) → 白(品牌) → 深(奖项) → 白(Notre rôle) → 深(页脚)**，四段同构被打断。

同一段的右侧叠上 Hero 那张 `xionsgroup-hero-light.svg` 作为背景。该 SVG 本身就是 `#0b0b0b` 底 + 亮 X，放在同色深底上不需要额外遮罩。第一版用 `cover` 满铺、`opacity:.55`，X 的亮瓣正好压在标题和正文后面影响可读性；改为宽度 `min(52%,46rem)`、右偏 14%、`opacity:.34`，并加 `mask-image` 让左缘渐隐，X 退成右侧的隐约存在。

### 全站滚动动效

新增 [src/scripts/reveal.ts](../../src/scripts/reveal.ts)，由 [SiteLayout.astro](../../src/layouts/SiteLayout.astro) 加载，**这部分会进生产构建**（与仅 dev 的文字编辑不同）。

- 目标：`.section-head`、`.split`、`.prose`、`.brand-card`、`.event-item`、`.role-step`、`.numbered-item`、`.page-hero-copy`、`.page-hero-aside`、`.footer-lead`、`.cta-band`、`.quote-panel blockquote`、`.awards-foot`、`.brand-intro-foot`。覆盖全部页面模板：首页 21 处、Press 10、集团 9、招聘 8、品牌页 4、联系 4。
- 效果：`opacity 0→1` + `translateY(14px)→0`，0.8s，缓动沿用全站已有的 `--ease-luxury`。同一父元素下的兄弟元素按 70ms 递增错开，最多累计 4 档，避免长列表末尾等待过久。
- **Hero 整段排除**：它有自己的 WebGL 动画，且 `.hero-content` 依赖 `mix-blend-mode:difference`；加 transform 会新建层叠上下文，直接破坏混合模式。
- 兜底：隐藏用的 CSS 挂在 `[data-reveal-ready]` 上，而该属性只由脚本设置，因此**没有 JavaScript 时所有内容正常显示**；`prefers-reduced-motion: reduce` 下直接显示、不过渡。元素显形 1.2s 后清掉 `transition-delay`，避免后续回流重新错开已定位的元素。

## 后续微调（同轮第二次）

- **X 背景加强**：用户反馈深色段的背景"太浅了，看不出来"。宽度 `min(52%,46rem)` → `min(62%,54rem)`，不透明度 `.34` → `.85`，左缘渐隐起点 55% → 48%。试过把 X 下移到 `right bottom` 和 `right 38%` 以避开第三列奖项名，但 `cover` 裁切下这两个位置反而让 X 几乎看不见，最终保留 `right center`。1286px 下第三列（x 874–1235）确实落在亮部上，白字 `#f4f1ec` 仍可读。
- **工具箱启动按钮 404**：从终端日志发现 `SiteLayout.astro` 里悬浮的"设计工具箱"按钮链接写成 `/design-preview?path=...`，缺尾斜杠，实际返回 404（与[上线前检查](../launch-readiness-2026-09-22.md) A1 同源）。已补为 `/design-preview/?path=...`。
- **日志索引补漏**：本轮发现 `homepage-typography`、`inline-text-editing`、`homepage-rhythm-and-motion` 三条记录写了但没挂进 `README.md` 与 `docs/project-log/README.md`，`launch-readiness` 也从未被任何索引引用。已全部补上，并加了一个脚本化核对（见下）。

## 证据

- `npx tsc --noEmit` 无输出；`npm run build` 37 页、38 份内部链接、34 个双语页面全部通过。
- 浏览器实测：首页 21 个 reveal 目标，Hero 内 0 个；滚动到 `#vision` 后 4 个转为已显形，`.prose` 的 `opacity` 为 1、`transform` 为 none。
- 错开实测：相邻品牌卡的 `transition-delay` 依次为 0ms、70ms。
- 减弱动态规则确认存在于样式表中。
- 四张品牌卡的底图状态核对：L'Entropiste 有、Betenoir 无、Sunlution 无、Masqly 有。

## 发布状态

**仅本地修改，未提交、未推送。**

## 未完成 / 待用户确认

1. **Betenoir 和 Sunlution 缺主图**，这两张卡目前没有底图，与另外两张不完全一致。补图后自动生效，无需改代码。
2. 深色段落是对"白/近白主体"既有基调的一次扩展，已获用户采纳第 2 条为依据；若不满意可单独回退该段样式。
3. 动效在真机上的观感与性能未测。
