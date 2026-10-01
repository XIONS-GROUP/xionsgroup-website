# 2026-09-22 · 市场部素材接入与页面重排

承接[同日节奏与动效记录](2026-09-22-homepage-rhythm-and-motion.md)。

## 用户需求

1. 压缩 `public/XIONS/` 里市场部给的原片，原片目录保持不动。名人照确认可用。
2. 首页奖项段背景要有动态效果（此前答应过但一直没做）。
3. 集团页三位创始人：去掉编号，姓名与职务上下紧贴，竖版合影放在左侧并列，照片尺寸调小。
4. 品牌模板：去掉图片下方的说明小字；并排的细节图要裁成等高，规则适用于所有模板页。
5. Press：删掉全部占位图与图注，只剩一张图时重新排好。
6. Engagements：重新排版，去掉大面积红色，维持全站黑白。
7. 品牌卡的粒子爆炸动画不要了，恢复白底。
8. 提问：英文 house 与法文 maison 是否同义、是否该在英文里也用 maison。

## 实施结果

### 素材

14 张原片（127MB，最大单张 72MB / 11057×13279）用 `sips` 压到网站尺寸，合计约 3.5MB，输出到 `public/images/` 下 `brands/`、`group/`、`press/`，命名沿用 `visuals.json` 既有规范。`.HEIC` 浏览器不支持，已转 JPEG。**原片目录未改动**，按用户要求保留。

填充 8 个此前为空的槽位，并按实际图片修正槽位比例（`group-team` 由 3/2 改 9/16 竖版，`sunlution-hero` 由 3/2 改 16/9）。新增 8 条 alt 文案的英文对照——构建的双语校验缺任何一条都会失败，本轮因此失败过两次。

仍未使用：戛纳红毯第二张、名人手持产品两张，待 Press 版面确定后安排。仍为空的槽位：首页两个摄影 Hero、Betenoir 主图、其余 6 个活动槽与 3 个 campaign 槽。

### 页面

- **集团**：合影与名单改为左右并列（`minmax(0,22rem)` + `1fr`），照片限宽，此前是整幅宽度、明显过大。删除 01/02/03 编号，姓名用 display 衬线、职务紧贴其下 0.35rem。
- **品牌模板**：删除 `<figcaption>`；`VisualSlot` 新增 `ratio` 参数覆盖资源自身比例并强制 `object-fit:cover`，细节网格统一 4:5。Sunlution 实测两张均为 760px。该参数对所有模板页通用。
- **Press**：过滤条件由 `v.src || visualPreview` 改为 `v.src`，占位线框块不再渲染；删除图注与 campaign 图片网格；仅存的戛纳照改为图文并列版面。
- **Engagements**：`quote-panel`（酒红满幅）换成 `#0b0b0b` 黑底白字的 `statement`；三条承诺由 `numbered-list` 改为三栏 `commitment-grid`。
- **首页奖项段**：背景 X 加入 26 秒 `awards-drift` 动画，缩放 1→1.07、轻微位移、透明度 0.78–0.92，关键帧间隔刻意不均匀以避免看出循环；`prefers-reduced-motion` 下关闭。
- **品牌卡**：粒子爆炸动画及 `brand-burst.ts` 按要求撤回，恢复纯白底。

### 修掉一个自己埋的缺陷

模板里手写 `data-reveal` 的元素会被 `[data-reveal-ready] [data-reveal]` 的 CSS 设为 `opacity:0`，但它们不在 `reveal.ts` 的目标选择器内，观察器不会处理，因此**永远不会显形**。集团页的创始人整块曾因此完全不可见。目标选择器现已包含 `[data-reveal]`，并补入本轮新增的 `.commitment`、`.direction`、`.event-layout`。

## 证据

- `npx tsc --noEmit` 无输出；`npm run build` 37 页、38 份内部链接、34 个双语页面通过。
- 页面正文图片数：Sunlution 0→3，Masqly 1→3，L'Entropiste 1→2，集团 0→1，Press 0→1。
- Sunlution 细节图实测等高 760/760；全站 `figcaption` 数量为 0。
- Press 页占位图数量 0、图注 0、实际图片 1。
- Engagements 页 `quote-panel` 数量 0，`statement` 背景 `rgb(11,11,11)`，承诺为三栏。
- 集团页 `.direction` 修复后 `data-reveal="in"`、`opacity:1`；全页 7 个 reveal 目标中 6 个显形，未显形的一个在视口下方，符合预期。

## 未完成 / 待用户确认

1. **house / maison**：两者同义，英文 house 在奢侈品语境是标准说法，现译无误；若想强调法国血统可在英文保留 maison。属品牌调性选择，未擅自改动已确认文案。
2. 英文翻译整体复查，用户表示之后统一处理。
3. Careers 页尚未重排。
4. 剩余两张可用图待排入 Press。
5. `public/XIONS/`（127MB）与根目录 29MB 的 `.ai` 仍未跟踪地留在 `public/`，构建产物仍会被撑大，见 PROJECT_STATUS。
