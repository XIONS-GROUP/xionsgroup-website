# 2026-10-22 · Betenoir 品牌页从「即将上线」换成上线版

## 需求

Neo 10-22 晚：BN 已上线，集团官网要更新 BN 的品牌信息；从 BN brand book 找内容，先出预览，他说 OK 再上线。

## 改了什么

| 位置 | 之前 | 之后 |
|---|---|---|
| `src/data/brands.ts` 的 betenoir | 「À venir · 2026」、「Une nouvelle maison est en préparation.」、三条占位理念、`websiteLive: false`（只显示「betenoir.com · Bientôt en ligne」） | brand book 文案：标语 *La vérité, à même la peau.*（第四轮换成定位句）；导语、两段正文（Persona 与 la bête、présence）；三栏 Cinq visages / Les parfumeurs / L’objet；`websiteLive: true`，显示「Site officiel ↗」并进 JSON-LD 的 `sameAs` |
| 类别 | Parfumerie | Parfumerie de niche |
| `src/data/visuals.json` | `betenoir-hero` 叫 coming-soon、alt 是「Visuel d’annonce」、标 optional | 文件改名 `betenoir-campaign-hero.webp`（同一张图），alt 改成描述画面；新增 `betenoir-detail-01/02`（KV NO FILTER 两张，1440×1928 sRGB WebP q88，网格里裁成 4:5） |
| `src/i18n/en.ts` | BN 占位文案的英文 | 新文案的英文，用词照 brand book 英文版（the beast、the 5 faces、maison）；删掉不再用的占位行 |

- 文案来源：`BETENOIR_BRANDBOOK_2026_FR`（第 2–4、9–12 页）和它的英文版；只删减、合并，不加新说法。和 BN 官网 À propos 页（`betenoir-website/docs/A_PROPOS.md`）同源、口径一致。
- 正文里品牌名大写 BETENOIR（BN 品牌规矩）；`name` 仍是 Betenoir，和导航、其他三家的大小写一致。
- 法文排版：« : » 前、« 37 ml » 里用不断行空格；NO FILTER、NUIT BLANCHE 词内不断行（桌面版第一次截图 NUIT / BLANCHE 被拆成两行）。
- Instagram 还是 `null`：betenoir.com 和主题里都没有 BN 的账号，等 Neo 给。
- 没放：Emmy 等媒体曝光（BN 官网 10-21 也先不放）、价格、Neo Su 艺术指导一段。

## 验证

- `npm run build`：构建、38 个文件内链、34 个双语页面文案覆盖全部通过。
- 本地 `astro preview` + chrome-headless-shell 整页截图：BN 法 / 英、品牌总览，1280 和 390 两种宽度；图片全部加载，控制台无报错。截图在创意系统仓库 `work/XG/2026-10-22_xg-site-bn/shots/`。

## 第二轮（Neo 10-22 23:20 看过预览）

- 细节图：左边换成 brand book 第 14 页（NUIT BLANCHE）那张女人（`betenoir-portrait-01.webp`，原图 1968×2464）；右边换成为户外广告修过的 Visual 2（KV5 那版，瓶盖重打光、NO FILTER 换色、积液补缺），文件 `betenoir-no-filter-01.webp`。网盘 KV 文件夹的 `BN-Visual-2.png` 也换成了新版，旧版在 `99 archive/02-brand visual/output/KV/`。
- 「Cinq visages」「Les parfumeurs」从一段话改成一行一个：名字红色（`--wine`），后面是 slogan（BN 官网商品页的 tagline，如 *La bête qui refuse le camouflage.*）/ 调的款；删掉「Cinq personnalités, pas cinq pyramides olfactives.」。调香师顺序 Vincent Ricord、Bertrand Duchaufour、Théo Monterosso。
- 代码：`pillars` 的第二项可以是 `[名字, 一行]` 列表，`BrandPage.astro` 渲染成 `<dl class="pillar-rows">`；有列表的页三栏改 1.15 : 0.95 : 0.9（1280 宽时每行不折行，700 以下仍一栏）。`check-localization.mjs` 的不翻译词加了五款名、三位调香师名。`[review].astro` 读 `optional` 前先判断字段在不在（首图去掉 optional 后 astro check 报错）。
- 验证：`npm run build` 全过，`astro check` 0 错；1280 宽实测十行全是一行。

## 第三轮（Neo 10-22 23:35）

- 五款下面那句换回第一版的动词（Se révèle、Règne、Se retire、Se met en scène、S’abandonne，和 BN 官网 À propos 一致；英文 Reveals itself / Reigns / Withdraws / Takes the stage / Lets go），「La bête qui…」那组不用。
- 改成上下排：名字红字放大（1.15rem），下面一行小字（.8rem）；调香师同样，人名在上、调的款在下。
- 上下排不再需要加宽栏，去掉第二轮的 `has-rows` 三栏比例，三栏回到等宽。

## 第四轮（Neo 10-23）

- 品牌页大标题下、品牌总览卡片 logo 下那句（`tagline`）改成对外的商业定位句：*Le parfum comme une pièce de mode : avant-gardiste, décalé, sans masque.*（英文 *Fragrance as a fashion piece: avant-garde, offbeat, unmasked.*），替换 brand book 的 *La vérité, à même la peau.*；等 Neo 定稿。
- 第一稿的 audacieux 换成 avant-gardiste：正文写着「la vraie rareté n’est plus l’audace」，品牌总览上 L’Entropiste 也用 audacieuse。
- 手机 390 宽会在「avant-」后断行：连字符后加 U+2060（word joiner），`brands.ts` 和 `en.ts` 的键都带上，`translate()` 按原文查。

## 发布状态

- 2026-10-23 Neo 确认（「就维持现在这个预览窗口的样子，然后直接可以上线了」）：dev 合并进 main（714ccfd），`npm run build` 全过，推送后约 30 秒生产更新。
- 生产核对：https://www.xionsgroup.com/fr/marques/betenoir/、/en/brands/betenoir/、/fr/marques/、/en/brands/、/fr/ 全部 200，`robots` 为 index, follow（无 noindex），`/sitemap.xml` 有 BN 法英两页，三张 BN 图都 200；chrome-headless-shell 整页截图 1280 和 390 宽，图片全加载。
- 还没做：BN 的 Instagram（@betenoir_paris）还没填进 `brands.ts`，等 Neo 点头再上。
