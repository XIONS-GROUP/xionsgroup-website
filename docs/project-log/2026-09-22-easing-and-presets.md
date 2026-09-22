# 2026-09-22 · 可调缓动与工具箱版本保存

承接[同日接缝记录](2026-09-22-loop-seam.md)。

## 用户需求

1. 时长按工具箱截图改为 1/6/1/4/2/6，合计 20 秒。
2. “给这些动画加入加速度，就是缓动的这么一个效果。比如说旋转啊，入场啊，出场啊，让它更加的 smooth 一些。”
3. 工具箱要有保存按键和不同版本，手动存到本地文件，以便助手直接读取用户改过的参数。
4. 询问常驻后台的 dev server 是什么、是否必须常开、是否消耗额度。

## 参数：旧值 → 新值

| 项目 | 旧值 | 新值 |
| --- | --- | --- |
| 白场停留 | 2s | **1s** |
| 白场 → X | 10s | **6s** |
| 旋转前停留 | 2s | **1s** |
| 旋转 180° | 4s | 4s（未改） |
| 旋转后停留 | 2s | 2s（未改） |
| X → 白场 | 5s | **6s** |
| 合计 | 25s | **20s** |
| 缓动曲线 | 固定五次 S 曲线 | **可调，默认 power 3** |
| 旋转峰值角速度 | 84.4°/s | **135°/s** |

流光强度 290%、速度 0.55×、X 高度、比例和噪点未改。

## 实施结果

### 缓动

[src/config/hero-light.ts](../../src/config/hero-light.ts) 的 `motionEase` 换成带指数的对称 S 曲线：

```
E(t, k) = t^k / (t^k + (1-t)^k)
```

`k=1` 是匀速，`k` 越大两端停得越久、中段加速越猛；峰值斜率正好等于 `k`。原来的五次曲线 `6t⁵-15t⁴+10t³` 峰值斜率是 1.875，所以旧观感等价于 `k=1.875`。默认取 **3**：比原来明显更有加速度，但不至于中段甩得太快（`k=5` 时旋转峰值会到 225°/s，作为默认过猛，留给滑块）。形成、旋转和退场共用这一条曲线。

关键性质：`E(1-u) ≡ 1-E(u)` 对任意 `k` 成立，所以[接缝记录](2026-09-22-loop-seam.md)里“退场是形成的严格倒放”不受影响，调缓动不会破坏首尾衔接。原 `rotationEase` 别名删除，统一用 `motionEase`。

新增 `heroLightEase`、`normalizeEase`，`heroFrame` 增加第四个参数 `power`。

### 工具箱保存与版本

- [scripts/design-presets-dev.mjs](../../scripts/design-presets-dev.mjs)：Vite `configureServer` 插件，`apply:'serve'`，只在 dev 生效。`GET /__hero-presets` 列出版本，`POST` 保存一个。文件名由时间戳加消毒后的名称拼成，正则只保留字母数字（含中文）、空格、下划线和连字符，再用 `path.dirname` 复核落点必须在预设目录内；请求体上限 64KB。已实测 `../../../../etc/passwd-pwn` 会被压成 `etcpasswd-pwn`，不会逃出目录。
- 存放位置 `local-materials/hero-presets/`，被 gitignore 覆盖，不进仓库也不部署。符合“工具箱试值不是源码默认值”的规则。
- [src/scripts/preview-toolbox.ts](../../src/scripts/preview-toolbox.ts)：新增“保存与版本”区块，保存工具箱全部参数（尺寸、噪点、流光、缓动、时长），列出最近 20 个版本并可一键载入；载入会同步写回 localStorage 并重播动画。
- [src/pages/\[preview\].astro](../../src/pages/[preview].astro)：新增“缓动”和“保存与版本”两个分组及样式。

### 顺带修掉的构建杂物

`[preview].astro` 的 `getStaticPaths` 在生产返回空数组，路由确实不会生成，但 Astro 仍会把页面的 hoisted script 打进 `dist`——一个没有任何 HTML 引用的孤儿 chunk。加入预设代码后它涨到 8.5KB，还把 dev 端点路径字符串带进了产物。改成 `if (import.meta.env.DEV) import(...)` 后 Vite 直接摇掉，`dist` 里不再有工具箱 JS。页面 scoped 样式 `_preview_.*.css`（约 4KB、无逻辑、无引用）仍会生成，属于既有现象，未处理。

## 证据

- `npx tsc --noEmit` 无输出；`npm run astro -- check` 48 文件 0 错误/警告/提示。
- `npm run build` 37 页通过；链接与双语检查通过。构建后 grep 确认 `dist` 中已无 `hero-presets` / `preset-save` / 工具箱 JS。
- 端点实测：空目录 GET 返回 `{"presets":[]}`；路径穿越 POST 被消毒；保存、列出、载入完整走通，载入后 localStorage 与界面同步回滚。
- 缓动实测 `power = 1 / 2.5 / 5 / 8`：接缝处 formation 0→0、角度 180°→180° 全部连续；形成与退场在镜像时刻的装配进度差 < 1e-12。旋转峰值角速度 45 / 112.5 / 225 / 359.8 °/s，与理论峰值斜率 `k` 吻合。
- 工具箱清空本地存储后读到默认值：合计 20 秒、1/6/1/4/2/6、缓动 3.0、流光 290% / 0.55×。

## 关于常驻的 dev server

`npm run dev` 是本机的 Astro 开发服务器，只为本地预览和 `/design-preview/` 工具箱服务。它是用户机器上的本地进程，不向 Anthropic 发送任何东西，**不消耗额度**；额度只由对话轮次和工具调用产生。想用工具箱就得开着，不用时可以直接停掉，网站代码和构建都不依赖它。

## 发布状态

本地已验证 → 已提交 → 已推送 dev。Netlify 分支预览与实机效果**尚未**验证。main 未动。

## 未完成 / 待用户确认

1. 缓动默认 3 是助手选的折中值，用户可用滑块试到满意后保存版本，再让助手写进源码默认。
2. 真实手机 GPU 负载与可读性未测。
3. Netlify `dev` 分支预览部署结果待确认。
