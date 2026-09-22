# 上线前检查 · 2026-09-22

对 `dev` 分支当前源码与构建产物的实测结果。结论基于本地构建、生产环境变量模拟构建和浏览器核对；**未**访问 Netlify 后台、未验证远端部署、未做真机性能测试。

## 一句话结论

技术骨架已经完整，**真正卡上线的是三件事**：全站内链缺尾斜杠、隐私政策与表单不一致、以及 28 个视觉位里有 20 个没有图。

---

## A. 必须先解决（会影响正确性或合规）

### A1. 全站内部链接缺尾斜杠 — 影响面最大

Astro 配置是 `trailingSlash: 'always'`，页面生成为 `/fr/marques/index.html`，但站内链接几乎全部写成不带尾斜杠。本地实测：

| 路径 | 状态 |
| --- | --- |
| `/fr` | **404** |
| `/fr/` | 200 |
| `/fr/marques` | **404** |
| `/fr/marques/` | 200 |
| `/fr/contact` | **404** |
| `/fr/contact/` | 200 |

构建产物里这类链接的出现次数：`/fr/marques` 155 次、`/fr/groupe` 145 次、`/fr/contact` 140 次、`/fr/presse` 125 次、`/fr` 73 次，法律页各 34–38 次。

Netlify 通常会 301 补斜杠，所以线上大概率"能用"，但每次站内跳转都多一跳，而且本地开发点任何导航都是 404。这是把正确性外包给托管商的行为。`check-links.mjs` 没有拦住，说明它做了归一化。

**建议**：统一给所有内链补尾斜杠，并让 `check-links.mjs` 对 `trailingSlash: 'always'` 做强校验。这是机械改动，涉及多个文件，**我没有擅自动**——需要你点头。

### A2. 隐私政策与实际表单不一致 — 合规问题

隐私政策原文：

> Ce traitement repose sur votre consentement, recueilli par la case à cocher présente dans le formulaire.

（处理基于您的同意，通过表单中的勾选框收集。）

但联系表单实际字段是：`name`(必填)、`email`(必填)、`company`、`subject`(必填)、`subject-detail`、`message`(必填)、`bot-field` 蜜罐——**没有任何勾选框**。

这是 PROJECT_STATUS 里挂了很久的第 3 项。两条路：加勾选框，或把法律依据改成"合法利益/履行询问请求"。**这需要公司决定**，我不会凭空改法律承诺。法英两版要同步。

### A3. 依赖有已知漏洞

`npm audit --omit=dev`：**4 个漏洞（1 critical、2 high、1 moderate）**，集中在 `esbuild` / `vite` / `sharp`（libvips 与 libheif 的 CVE）。官方修复路径是升到 `astro@7.3.3`，属于跨大版本 breaking change。

PROJECT_RULES 已经写明这件事要单独处理、不在视觉微调里顺带升级。建议上线前单开一轮，升级后完整回归。

---

## B. 内容缺口（不阻断技术上线，但决定网站是否"像做完了"）

### B1. 视觉素材：28 个位里 20 个空着

生产构建中空槽位**直接不渲染**（`VisualSlot` 在非预览模式下整块消失），所以不会露出占位符——但相关版块会变空。各页正文图片实测数量：

| 页面 | 正文图片数 | 说明 |
| --- | --- | --- |
| `/fr/` 首页 | 5 | 4 个品牌 logo + Hero SVG |
| `/fr/marques/` | 4 | 四个品牌 logo |
| `/fr/marques/lentropiste/` | 1 | 仅 logo |
| `/fr/marques/masqly/` | 1 | 仅 logo |
| `/fr/marques/sunlution/` | **0** | 整页无图 |
| `/fr/marques/betenoir/` | **0** | 未上线品牌，可接受 |
| `/fr/groupe/` | **0** | 缺团队合影 |
| `/fr/presse/` | **0** | 整个"鼎盛"展示页无图 |
| 其余（承诺/招聘/联系/法律/404） | 0 | 本就是纯文字页 |

缺的 20 张：首页桌面/手机主视觉、集团团队合影、L'Entropiste 获奖细节、Betenoir 预告、Sunlution 主视觉+2 张细节、Masqly 2 张细节、Press 的 7 张活动图、Press 的 3 张战役图。

**Press 页面是最突出的问题**——它是对外展示国际曝光的页面，现在一张图都没有。

### B2. 文案审核

集团陈述、品牌陈述和英文翻译尚未经公司终审。原文已修正版在 `local-materials/content/`。

---

## C. 发布流程尚未执行的步骤

1. **dev → main 尚未合并**。`main` 目前仍是预热占位页（`9b56a72`）。
2. **索引仍全站关闭**。`netlify.toml` 四个 context 的 `ALLOW_INDEXING` 都是 `false`；我用 `CONTEXT=production ALLOW_INDEXING=true` 模拟构建，验证了开关生效——robots.txt 正确变成 `Allow: /` 并带上 sitemap 地址。正式上线时才改 production 那一条。
3. **Netlify 表单端到端未验收**。成功页、后台存储、邮箱投递是三个独立检查点，目前只有成功页在本地验证过。需要你授权后用唯一测试标记走一遍。
4. **DNS / TLS / www 跳转未复查**。09-21 你提供过 Pending 提示，此后没有重新核对。
5. **Search Console 未验证、sitemap 未提交**。
6. **真机未测**。Hero 是 WebGL 动画，真实手机的 GPU 负载、发热和可读性都还没验过。

---

## D. 已经做好的部分（复核通过）

- 17 条路由 / 语言，sitemap 30 个公开 URL，37 个 HTML 页面全部构建通过。
- 法英双语完整：34 个本地化页面的正文、表单、法律文本、alt、metadata 全覆盖，构建时强校验，**任何未翻译的法文文本节点都会让构建失败**（这轮就拦下了一处）。
- 生产构建正确排除了 `/fr/visual-plan/` 和 `/design-preview/`，工具箱 JS 也不进产物。
- SEO：canonical、hreflang、JSON-LD、robots、sitemap、分享封面齐备，索引开关按 context 生效。
- 安全响应头：`X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`，`/__forms.html` 单独 noindex。
- 11 条无语言前缀的短链 302 重定向到对应语言页面。
- 首页四个板块标题字号字体现已统一。

---

## 建议顺序

1. 决定 A2 的法律依据（需要公司拍板，最慢）。
2. 补 Press 和 Groupe 的图（最影响观感）。
3. 修 A1 尾斜杠（机械活，等你一句话）。
4. 单开一轮做 A3 依赖升级 + 回归。
5. 授权后验收表单投递链路。
6. 再走合并 main、开索引、提交 sitemap。
