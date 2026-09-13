# XIONS GROUP - 项目规范与工作流程手册 (PROJECT RULES)

## 📌 一、 项目研发与核心代码规范

1. **核心代码存储唯一入口**：
   * 唯一生产代码库位于：`src/`（包括页面 `src/pages/`、组件 `src/components/`、静态资源 `public/`）。
   * 网站所有的生产资产改动均以 `src/` 目录为准。

2. **设计美学指导思想 (White Editorial Luxury Rule)**：
   * **定位**：法国顶级奢华美妆/香水集团（参照 Chanel, Byredo, Aesop, Le Labo 级别）。
   * **基调**：**高定白色极简社论风格 (White Editorial Luxury Theme)**（纯净高雅白背景 `#FFFFFF` + 黑字 `#0A0A0A`）。
   * **排版**：强调极简衬线/无衬线高字重对比、呼吸感留白、高定单栏与多栏网格交错版式。

3. **Logo 使用规范 (Restrained Logo Rule)**：
   * **禁止在页面主体内滥用 Logo**。Logo (`XIONS_LOGO.svg`) 优雅呈现在**顶部导航栏 (Navigation Header)** 与页脚 (Footer)。

4. **自动悬停下拉大菜单 (Hover Dropdown Mega-Menu)**：
   * 顶部导航栏分类（GROUPE, MARQUES, ENGAGEMENTS, CONTACT）支持**鼠标移入悬停自动触发下拉大菜单**（无需点击）。
   * 下拉菜单清晰呈现集团完整的架构树与子页面导航。

5. **图片替换工作流 (Image Replacement Workflow)**：
   * 用户提供图片或直接指定图片存放位置与对应组件。
   * AI 助手负责将图片归档至 `public/images/`，更新对应代码路径，并自动完成响应式与懒加载（`loading="lazy"`）优化。

---

## 🏗️ 二、 网站完整架构树 (Site Architecture)

- **GROUPE (集团介绍)**
  - *À propos* — 集团愿景与法式传承
  - *Équipe & Direction* — 创始人团队 (Denis Bellaïche, Kris Fang, Neo Su)
  - *Presse & Rayonnement* — 国际盛会与媒体声誉 (Oscars, Cannes, Grammys)
  - *Carrières* — 招贤纳士与岗位入口

- **MARQUES (品牌组合)**
  - *L'Entropiste* — Parfumerie de Niche (获奖小众香氛)
  - *Betenoir* — Parfumerie (Coming 2026 预告)
  - *Sunlution* — Cosmétique & Science (光感护肤)
  - *Masqly* — Body Care & Rituals (身体护理)

- **ENGAGEMENTS (品质与承诺)**
  - *Qualité & Formules* — 顶级原料与高标准
  - *Responsabilité* — 透明度与伦理承诺
  - *Environnement* — 绿色可持续创新

- **CONTACT (联系入口)**
  - *Paris Headquarters* — 巴黎总部
  - *Business & Distribution* — 商务与渠道合作
  - *Press Contact* — 媒体与公关
  - *Careers & Talent* — 自荐与人才招募

---

## 🔄 三、 Git 与自动构建发布流程

1. **分支策略**：
   * `dev` 分支：实时开发与预览（对应 Netlify 预览 `https://dev--xionsgroup.netlify.app`）。
   * `main` 分支：正式生产发布（对应正式域名 `xionsgroup.com`，未正式发布前保持极简 Logo 遮罩预热页）。

2. **自动构建构建流**：
   * 任何在 `dev` 分支的推送到 GitHub 均会自动触发 Netlify 云端构建。
