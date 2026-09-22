# XIONS GROUP — 当前项目规则

更新：2026-09-22。先读[README](README.md)、[状态](PROJECT_STATUS.md)、[日志](docs/project-log/README.md)、[Map](docs/project-map.md)。用户最新决定优先。.agents/AGENTS.md留有早期重复规划，不能据它恢复已替代的旧导航/旧Hero。

## 项目边界

- 根目录唯一入口；src/public是网站代码/资产，archive不部署，local-materials公司原件不发布。
- Astro静态集团站，法英共享模板，非Shopify、无CMS。content/home.fr.json不是首页实时数据源。

## 设计与交互

- 简约社论式官网；白/近白主体、黑字、#c20000。首页黑白X动画是明确批准的设计。
- 不无差别加图片、分隔线、箭头或大写；主导航大写，子项和正文正常大小写。
- Logo主要在导航/页脚；用户要求的四品牌卡居中Logo保留。
- 只有Le groupe / Nos marques有桌面下拉且父项可点击；Press、Engagements、Carrières、Contact直链，悬停关闭下拉。
- 菜单和下拉共享白色磨砂面；手机全屏抽屉，集团不展开团队，品牌展开四家；全部品牌链接另置。
- 页脚显示当前FR/EN并切同页另一语言，与法律链接同字号/基线；手机菜单保留双语言选择。
- Hero以src/config/hero-light.ts为唯一参数源：390/650px、固定比例、25秒；工具箱试值确认后才写默认。
- 流光不分阶段，全程不停循环，只有速度和强度可调；旧“仅覆盖完整X三阶段”的规则已被2026-09-22用户决定替代。
- 退场是形成的倒放，首尾必须同帧；旋转角跨轮累加不归零。旧“光沿四臂扩散回白场”已被替代，不要恢复。
- 白场阶段白底灰X的反色观感是用户认可的效果，不要当成bug去消除。

## 内容与素材

- 修正原文为来源；不擅自删改已确认业务内容，不凭空增加获奖、合作、合规承诺。
- 当前媒体菜单名Press，不因旧口述Price新增价格页。
- 图片public/images/分类；尺寸/命名维护src/data/visuals.json。首屏关键资产优先，其余按需懒加载。
- 修改法文同步英文、alt、metadata；不新增在线翻译API。
- Contact用Netlify Forms，不因存在旧原型激活Resend；测试邮件需明确授权。

## 开发、发布和记录

- 先git status，保留已有改动。通常dev开发，依当前用户范围决定提交/推送；“先本地修改”优先。
- dev预览、main生产；未经发布要求不合并main、不强推。
- npm run build；TypeScript/Astro改动运行相应检查。推送成功不代表部署成功。
- 预览禁索引，生产启索引属于正式上线步骤。
- Netlify优先插件/CLI，避免Computer Use。DNS修改不影响公司邮件记录。
- 每轮实质修改追加docs/project-log/，记录需求/参数前后值/文件/验证/发布状态/待办，更新PROJECT_STATUS、Map或技术说明。历史不覆盖，旧决定标明被替代。
