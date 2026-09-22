# 法英双语与 SEO — 2026-09-21

## 页面与语言入口

- 法语保留 `/fr/`，英语使用 `/en/`；例如 `/fr/groupe/` 对应 `/en/group/`。
- 2026-09-22更新：页脚只显示当前 `FR` 或 `EN`，点击切换同页另一语言，字号/基线与法律链接一致；手机全屏菜单仍显示 `FR / EN` 两个选项。切换不通过浏览器语言或 IP 强制跳转。
- 语言选择依靠链接；不新增 Cookie、localStorage、翻译 API 或后台服务。
- 页脚已移除内部图片规划入口。`/fr/visual-plan/` 只在开发预览构建存在，保持 noindex，不进入 sitemap。
- 英文页面包含完整预渲染 HTML。正文、品牌介绍、法律页面、图片 alt、表单标签、错误提示、成功页和 404 均已翻译。
- 英文法律页面忠实翻译法语现有内容，不新增法律承诺。

## 如何维护

1. 布局在现有 `src/components/` 及 `src/pages/fr/` 中修改，两种语言共用模板。
2. 法文修改后同步更新 `src/i18n/en.ts`；法律翻译在 `src/i18n/legal-en.ts`。
3. 新增页面时更新 `src/i18n/routes.ts` 和 `src/pages/en/[...page].astro`。
4. `npm run build` 检查完整翻译、语言链接、所有内部链接、SEO 与表单字段；漏加翻译会使构建失败，避免发布混合语言页面。
5. `npm run dev` 本地预览；`npm run preview` 查看构建产物。

HTML 翻译在 Astro middleware 的构建/开发阶段执行，使用 parse5 解析文本与属性；不替换脚本、样式或表单提交值。英文表单仍提交到现有 Netlify Forms `contact`，字段名和分类值保持兼容，成功后进入 `/en/thank-you/`。此次没有引入 Resend 或其他发信服务。

## SEO 已实现

- 唯一正式域名 `https://www.xionsgroup.com`，每页独立 canonical。
- 双向 `hreflang=fr/en`，`x-default` 指向对应法文页面。
- 每页独立标题与描述，正确 HTML lang，法英 URL 分开。
- Open Graph / Twitter 分享卡片；封面 1200 × 630。
- Organization、WebSite、WebPage JSON-LD，使用现有已确认的公司资料。
- `/sitemap.xml` 包含 30 个公开页面及其语言对应关系；排除成功页、404、内部预览页和重复根首页。
- `/robots.txt` 按环境控制；预览站禁止索引。成功页、404 和内部页始终 noindex。
- 法英专属 404；域名与 SSL 保持现有配置。
- 分享图片在 Netlify dev 构建使用当前预览域名，正式构建使用官网域名，避免正式站尚未上线新素材时出现空图。

## 素材目录

| 用途 | 文件 | 像素 |
| --- | --- | --- |
| 全站分享封面 | `public/images/social/xionsgroup-og.png` | 1200 × 630 |
| 白底网站图标 | `public/images/site/xionsgroup-icon-512.png` | 512 × 512 |
| César 活动标识 | `public/images/awards/xionsgroup-event-cesar-01.png` | 720 × 481 |
| 品牌素材 | `public/images/brands/<brand>/` | 依视觉清单 |

根目录新图片已归类；César 更新版替换原标识。分享封面与图标状态已同步至 `src/data/visuals.json`。`public/__forms.html` 是表单声明文件，需要保留在原位置。

## 正式上线前

1. 审核英文品牌语气、日期与承诺，补齐已规划但尚未提供的摄影素材。
2. **必须确认隐私政策**：现有法文仍称表单通过勾选框取得同意，但实际表单没有此勾选框。此次保留原文及忠实翻译；上线前应由公司确认实际法律依据，再同步修订两种语言。
3. 正式发布 PR 中仅将 `netlify.toml` 的 `[context.production.environment]` 下 `ALLOW_INDEXING` 改为 `"true"`。默认、branch-deploy、deploy-preview 保持 false。
4. 合并 `dev → main` 后检查 www 主域、HTTPS、无 www 跳转、真实 404 状态、分享图片和所有页面。
5. 在 Google Search Console 验证公司域名（DNS TXT），提交 `https://www.xionsgroup.com/sitemap.xml`；如已有属性则复用。此项尚未操作。
6. 发布后检查索引报告、法英 canonical、移动端体验与 Core Web Vitals；SEO 配置不保证即时收录或搜索排名。

## 维护待办

- 新页面必须同时提供法英文和独立描述，图片提供两种语言的替代文字。
- 更新分享封面后平台可能仍显示缓存，需使用对应平台的重新抓取工具。
- 联系表单收件链路沿用现有 Netlify 配置；本次只验证字段兼容和界面，不发送额外测试邮件。
- npm 审计发现已有 Astro 4 及其构建依赖的安全公告；建议另开依赖升级维护任务。本站部署的是静态 HTML，此次没有加入运行时 Astro 服务，也未进行跨主版本升级。
