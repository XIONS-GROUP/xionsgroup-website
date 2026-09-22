# 2026-09-22 · 预览内直接改文字、字体字号控制、仓库迁移

承接[同日首页排版记录](2026-09-22-homepage-typography.md)。

## 仓库位置变更

项目从 `/Users/seajelly/Documents/Xionsgroup` 移到 **`/Users/seajelly/Developer/web-build/Xionsgroup`**。Git 历史与未提交改动完整保留，但 `node_modules` 没跟着迁移，需重新 `npm ci`。旧路径已不存在，早期日志里的绝对路径均按新根目录理解。

## 用户需求

1. 本地预览是否必须一直挂一个后台任务？
2. 工具箱里加一个按钮，按下后解锁网页上所有文字，直接在页面上增删、换行；再按一次关掉，恢复正常浏览。法英分开改，改完存到本地供助手读取。
3. 工具箱里能设置选中文字的字号、字体，把网站在用的字体列出来。
4. 英文页脚 `Imagine what comes next` 太长，改成 `Imagine the next`。

## 关于常驻后台任务

本地预览是一个真实的 HTTP 服务，必须有进程在跑——这次新增的文字编辑要把改动写到磁盘，更离不开服务端。但**它不必是助手托管的后台任务**：之前两次预览打不开，都是因为助手会话结束时把那个任务一起收掉了。让用户在自己的终端里跑 `npm run dev`，进程就独立于助手会话存活。本轮起改用这种方式启动。

## 实施结果

### 页面内文字编辑

新增 [src/scripts/text-edit-dev.ts](../../src/scripts/text-edit-dev.ts)，在被预览的站点页面里运行，由 [SiteLayout.astro](../../src/layouts/SiteLayout.astro) 以 `if (import.meta.env.DEV) import(...)` 动态引入，生产构建整体摇掉。

可编辑元素的判定：候选集是块级文字容器（`h1`–`h6`、`p`、`li`、`blockquote`、`figcaption`、`td`、`th`、`dt`、`dd`、`summary`、`label`、`button`、`a`、`span`），先筛掉没有文字的，再只保留**不含其他带文字候选后代**的叶子节点。`em`、`strong`、`br` 刻意不在候选集里，否则 `Imaginer<br><em>la beauté</em>` 这种标题会被拆成好几块，无法整体编辑。首页实测解锁 99 处。

"带文字"这个限定是第二版才加的。第一版只判断"有没有候选后代"，于是页脚那条 `<a>Imaginons la suite <span><Arrow/></span></a>` 两头落空：`<a>` 因为含 `<span>` 被排除，`<span>` 又因为只有 SVG、没有文字被排除，整句话点不动。改成只有带文字的后代才让父元素出局后，该链接正常可编辑，而纯图标的 `<span>` 仍然不会被误选。回归核对：Hero 标题、活动序号与名称（各自独立可编辑、其 `<li>` 不可编辑）、品牌卡片描述（其外层 `<a>` 不可编辑）、导航链接、页脚三个栏目标签均符合预期。

与工具箱之间用 `postMessage` 通信（同源校验），消息有 `text-edit-mode`、`text-style`、`text-collect`、`text-revert`，回传 `text-ready`、`text-selected`、`text-dirty`、`text-changes`。

三个实现细节值得记：

- **Hero 文字点不动**：`.hero-content` 设了 `pointer-events:none`（只给其中的 `a` 放行），点击会直接穿透。编辑态给所有可编辑元素补 `pointer-events:auto` 才解决。
- **换行**：`document.execCommand('insertLineBreak')` 在当前浏览器直接失效——Enter 被拦下但什么都没插入。改成用 Range 显式插 `<br>` 并把光标移到其后，与源码里标题使用 `<br />` 的写法一致。
- **链接不跳转**：编辑态下捕获阶段拦掉 `a` 的点击，否则一点就导航走了。

退出编辑时移除 `contenteditable` 与标记属性、解绑全部监听器，实测元素数归零、`pointer-events` 回到 `none`，即完全恢复正常浏览。

### 工具箱里的位置（一次返工）

第一版把「文字编辑」放进了 `#hero-options` 容器里。该容器由 `context()` 按当前可见区域切换显示，滚出首屏 Hero 就整块隐藏——于是解锁按钮看着像"只有 Hero 有"。功能本来就是全站的，纯粹是位置放错。

已移到设备切换旁边的全局区域，与手机/桌面开关同级，任何页面、任何滚动位置都常驻。同时补了一个**页面下拉**：编辑态下链接被拦截不跳转，需要另一条换页通道；下拉列出全部 16 条路由 × 法英两种语言（共 32 项，排除 404），切换后 iframe 载入新页，编辑模式凭 `text-ready` 消息自动重新武装，无需再点一次解锁。下拉也会随 iframe 内的语言切换自动同步。

### 字体与字号

选中任一可编辑元素后，工具箱显示它的元素路径和当前计算字体/字号，并提供：

- 字体下拉：不覆盖 / `var(--display)`（Faculty Glyphic · 标题衬线）/ `var(--sans)`（Plus Jakarta Sans · 正文无衬线）——就是站点实际加载的两款 Google 字体。
- 字号数字输入，另有一个清除覆盖的按钮。

改动以行内样式落在该元素上，并随文字一起被保存记录。

### 保存

[scripts/design-presets-dev.mjs](../../scripts/design-presets-dev.mjs) 由单路由改成路由表，现同时提供 `/__hero-presets` 和 `/__text-edits`，共用同一套文件名消毒与落点复核逻辑，请求体上限从 64KB 提到 512KB。文字改动写入 `local-materials/hero-presets` 的同级目录 `local-materials/text-edits/`，同样被 gitignore 覆盖。

每条记录含元素路径、原文、改后文字，以及（若改过）`fontFamily`、`fontSize`；结构或换行有变化时另存 `originalHtml` / `updatedHtml`。**改动只存在于预览和这些 JSON 里，不会自动写回源码**——保持"工具箱试值不是源码默认值"的既有规则。

### 可直接双击打开的离线副本

用户还要一份不依赖服务器、双击就能看的本地文件。构建产物做不到：资源引用是根绝对路径（`/_astro/…`、`/images/…`），页面链接又是无扩展名的目录形式，在 `file://` 下全部失效。

新增 [scripts/make-portable-preview.mjs](../../scripts/make-portable-preview.mjs)：复制 `dist`，按每个 HTML 的目录深度把根绝对路径改写成相对路径，无扩展名的页面链接补成 `…/index.html`，并去掉图片的 `?v=` 缓存参数（`file://` 会把查询串当成文件名的一部分）。输出到 `local-materials/portable-preview/`（gitignore 覆盖）。它**不接进 `npm run build`**，需要时单独跑，避免影响部署产物。

入口：`local-materials/portable-preview/fr/index.html`。谷歌字体仍走网络，离线打开会退到系统字体。

### 页脚箭头的换行

页脚主链接是 `<a>文案 <span><Arrow/></span></a>`，容器 `max-width:13ch`。箭头原本靠自然换行落位，于是**两种语言表现不一致**：1287px 桌面下法语排成 `Imaginons la suite` / `[箭头]`（箭头独占一行），英语则是 `Imagine the next [箭头]` 挤在同一行——纯粹因为法语那句更长。

在 [Footer.astro](../../src/components/Footer.astro) 加 `@media(min-width:701px){ .footer-lead > a span { display:block; } }`，桌面端强制箭头独占一行，与法语原有观感一致且不再依赖文案长度。断点沿用全站的 700px。手机端不加这条：实测 375px 下法语是 `Imaginons la` / `suite [箭头]`，箭头跟在末词后面，保持原状。

### 英文文案

[src/i18n/en.ts](../../src/i18n/en.ts)：`Imaginons la suite` 的英文由 `Imagine what comes next` 改为 `Imagine the next`。

## 证据

- `npx tsc --noEmit` 无输出；`npm run build` 37 页、38 份内部链接、34 个双语页面全部通过。
- 构建后 grep `dist`：无 `xions-editable` / `text-edit-mode` / `__text-edits` / `xions:text` 任何痕迹。
- 生产产物英文首页页脚确认为 `Imagine the next`。
- 离线副本 38 个页面、1807 条相对引用全部指向磁盘上真实存在的文件，无一失效。（浏览器面板会把面板外的 `file://` 转成 `data:` 快照，相对路径在快照里必然解析失败，所以该处改用磁盘校验而非面板渲染来验证。）
- 全局性实测：滚到「Notre rôle」区域时 `#hero-options` 已隐藏，而文字编辑区块仍可见可用；用页面下拉从 `/fr/` 切到 `/fr/presse/`（113 处可编辑）再切到 `/en/group/`（71 处），编辑态全程保持，下拉值与实际页面同步；在英文页改标题并保存，落盘文件正确记录 `page: /en/group/` 与原文。
- 浏览器实测：解锁后 98 处可编辑；真实鼠标点击 Hero 标题能选中并回报 `h1.display · Faculty Glyphic 58.5px`；字号改 18px、字体切 `var(--display)` 后计算样式确为 `18px / "Faculty Glyphic"`；真实键盘输入生效；Enter 在光标处正确插入 `<br>`；还原按钮恢复原始 HTML；保存后磁盘文件包含原文与改后文字；关闭编辑模式后可编辑元素数归零。

### 测试中遇到的一个假警报

浏览器自动化工具发出的 Return 键，其 `KeyboardEvent.key` 是空字符串，因此 `key === 'Enter'` 判断不成立，一度误以为换行功能坏了。用标准 `KeyboardEvent({key:'Enter'})` 验证后确认逻辑正确。真实键盘不受影响，但后续若再用自动化验证按键行为，需注意这一点。

## 发布状态

**仅本地修改，未提交、未推送。** 连同上一轮的首页改动一起等待用户确认。

## 未完成 / 待用户确认

1. 文字改动需要用户确认后，由助手手动写回 `.astro` 源码或 `src/i18n/en.ts`，目前不自动回写。
2. 上一轮[上线前检查](../launch-readiness-2026-09-22.md)里的三项阻塞仍未处理。
