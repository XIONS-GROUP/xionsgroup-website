# 2026-09-22 · 入场缓动放慢、首页标题统一与两个模块重做

承接[同日缓动与版本记录](2026-09-22-easing-and-presets.md)。同轮另出[上线前检查](../launch-readiness-2026-09-22.md)。

## 用户需求

1. 加了缓动之后「刚开始这个 X 进场的时候，这个入场变得特别快」，要更慢的缓动。
2. 首页所有标题字号统一，**以 Notre vision 的「Créer des maisons capables…」为准**；`Quatre maisons, quatre regards` 要和上面一致。
3. 第二个板块的 eyebrow `Le portefeuille` 改成 `Nos marques`。
4. 六个奖项去掉 logo，**改成纯文字展示**。
5. `Notre rôle` 模块和 `Quatre maisons, quatre regards` 标题块「排版太过于简单」，按全站设计重做。
6. 先给本地预览，**不推送 dev**。

## 参数与改动：旧值 → 新值

| 项目 | 旧值 | 新值 |
| --- | --- | --- |
| 缓动结构 | 单一 `power`，形成/旋转/退场共用 | **拆成 `formation` 与 `rotation` 两条** |
| 入场 / 退场缓动 | 3 | **2** |
| 旋转缓动 | 3 | 3（未改） |
| 形成中段速度 | 50 %/s | **33.3 %/s** |
| 旋转峰值角速度 | 135°/s | 135°/s（未改） |
| 品牌板块 eyebrow | Le portefeuille | **Nos marques** |
| 品牌板块标题 | `.title-xl`（最大 7.2rem） | **`.title-lg`（最大 5rem）** |
| 六奖项呈现 | 6 张 logo 图 | **编号 + 名称的纯文字索引** |
| 首页正文图片数 | 11 | **5**（4 个品牌 logo + Hero SVG） |

时长仍是 1/6/1/4/2/6 共 20 秒；X 尺寸、比例、噪点、流光强度与速度均未改。

## 实施结果

### 缓动

[src/config/hero-light.ts](../../src/config/hero-light.ts)：`heroLightEase` 从 `{power}` 改为 `{formation, rotation}`，`heroFrame` 第四参数改收整个 ease 对象。入场和退场**必须**共用 `formation` 那一个值，否则退场不再是形成的严格倒放、首尾衔接会破。工具箱的缓动滑块相应拆成两条。

需要说明：入场变快的主因其实是上一轮把「白场 → X」从 10s 缩到 6s，缓动只是次因。现在 6s + power 2 的中段速度是 33.3 %/s，仍高于最早 10s + 等效 1.875 时的 18.75 %/s。要回到那种从容感，得把时长调回去，光靠缓动不够。

### 首页标题

四个板块标题现在都是 `.title-lg`，浏览器实测同为 52.4px / Faculty Glyphic：Notre vision、Nos marques、Présence internationale、Notre rôle。原来只有品牌板块用 `.title-xl`，以及一条手机端 `.brand-section .title-xl` 覆盖，一并删除。

### 六奖项改纯文字

删除 `.awards-grid` / `.award-logo` 及六张 `<img>`，改成 `.event-index`：无序列表，每项一条细分隔线、一个序号和 display 衬线的奖项名，桌面三列、平板两列、手机一列。`eventMarks` 的 `src` 字段保留未删，Press 页面的活动图库另有自己的槽位。

### 两个模块重做

- **品牌板块头部**：eyebrow 与标题保持社论式两栏，标题下加一条细线和「Voir les marques」链接。原先它是首页唯一没有出口链接的板块，其余三个都有；补上后四个板块结构一致。
- **Notre rôle**：从扁平的三行 `.numbered-list` 改成三栏 `.role-grid`。每栏一条实色顶线、序号、display 衬线小标题和描述；900px 以下改为单列堆叠。全局的 `.numbered-list` / `.numbered-item` 未动，groupe、engagements、carrieres 三页继续沿用。

**没有新增或改写任何法文业务文案**，全部沿用已确认原文；新加的只有一个已存在的链接短语「Voir les marques」（en.ts 已有 `Voir les marques|Explore the brands`）和 `Nos marques`（已有 `Nos marques|Our brands`）。

### 被本地化检查拦下的一处

品牌板块头部原本还加了一个「01 — 04」计数器，`check-localization.mjs` 报 `Missing English copy: 01 — 04`——它对每个法文文本节点都要求英文对应，纯数字才豁免。该计数器本就是装饰、且与下方四张卡片重复，直接删除而非加豁免。

## 后续微调（同日第二轮）

用户反馈两个模块在桌面端过挤、分隔线多余：

- 奖项模块去掉每项的细分隔线和 01–06 序号，只留六个名称。名称字号由 `clamp(1.35rem,2.2vw,2rem)` 提到 `clamp(1.5rem,2.4vw,2.2rem)`，行间距从紧贴的 `padding:1.6rem 0` 改成 `gap:clamp(2.25rem,4vw,3.5rem)`。手机端仍是单列，但间距收到 1.25rem，避免六行拉得太长。
- Notre rôle 去掉每栏的实色顶线，列间距 `clamp(2rem,4vw,4rem)` → `clamp(3rem,6vw,6rem)`，900px 以下单列时补上 `clamp(2.5rem,7vw,3.5rem)` 的纵向间距（原为 0，靠边框分隔）。
- 两个模块的上下留白由全局 `.section` 的 `clamp(4rem,7vw,7rem)` 提到 `clamp(5rem,9vw,9.5rem)`，标题区下方留白由 `clamp(3rem,6vw,5rem)` 提到 `clamp(4rem,8vw,7rem)`。

1693px 下奖项模块高度 915px → 1041px，Notre rôle 648px → 739px，均无横向溢出。

## 证据

- `npm run build` 通过：37 页、38 份 HTML 内部链接、34 个双语页面全部检查通过。
- 浏览器实测四个标题 `font-size` 与 `font-family` 完全一致（52.4px / Faculty Glyphic）。
- 英文版核对：eyebrow 译为 Our brands、链接译为 Explore the brands 且指向 `/en/brands/`、三个步骤正确翻译。
- 手机 375px 实测无横向溢出，奖项索引与 Notre rôle 均正确降为单列。
- 缓动实测：接缝处形成进度差 2.8e-8（仅 1ms 采样偏移）、角度差 0；形成与退场在 u=0.2/0.5/0.8 三处镜像值差 < 1e-12，衔接未破。
- 旧的 `{"power":2.5}` 本地存储在新结构下回落到默认 2.0 / 3.0，未报错。

## 发布状态

**仅本地修改，未提交、未推送。** 按用户要求先看本地预览。

## 未完成 / 待用户确认

1. 入场速度是否够慢；如仍偏快，建议把「白场 → X」从 6s 调回 8–10s，而不是继续压缓动值。
2. 重做后的两个模块是否符合预期。
3. 上线缺口见[上线前检查](../launch-readiness-2026-09-22.md)。
