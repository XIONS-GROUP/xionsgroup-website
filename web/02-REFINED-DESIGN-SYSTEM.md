# XIONS GROUP 网站 - 精致设计系统
## 基于 Mobbin 高端案例的重新设计

> **设计理念**：极简奢华、黑白主调、调性十足  
> **参考对象**：Mobbin 上的奢侈品牌、建筑事务所、艺术画廊  
> **核心原则**：Less is More, 留白的力量，细节的精致

---

## 🎨 设计灵感来源（Mobbin 风格参考）

### 参考品牌类型：

**1. 奢侈品牌网站**
- Byredo (香水) - 极简、大图、黑白
- Aesop - 克制、网格系统、细腻动画
- The Row - 极度留白、serif 字体、无装饰
- Maison Margiela - 前卫、非对称、强视觉

**2. 建筑/设计工作室**
- Zaha Hadid Architects - 流动感、几何、黑底白字
- John Pawson - 极简主义大师、纯净
- Tadao Ando - 光影、留白、细节

**3. 艺术画廊**
- Gagosian Gallery - 高端、严肃、经典
- Hauser & Wirth - 现代、优雅、呼吸感

### 设计关键词提取：

```
✓ 大量留白（whitespace）
✓ 克制的动画（subtle animations）
✓ 衬线字体标题（serif headings）
✓ 非常规网格（broken grid）
✓ 视觉焦点明确（clear hierarchy）
✓ 黑白对比强烈（high contrast）
✓ 细线分隔（hairline dividers）
✓ 极少颜色点缀（minimal accent）
✓ 视差微妙（subtle parallax）
✓ 过渡优雅（smooth transitions）
```

---

## 🎨 更新的配色方案

```
┌─────────────────────────────────────────────────────────────┐
│                主色调 - 黑白灰系统                            │
└─────────────────────────────────────────────────────────────┘

████ #000000  纯黑       - 背景、粗标题、CTA按钮
████ #FFFFFF  纯白       - 背景（交替）、文字
████ #0A0A0A  深黑       - 微妙差异的背景
████ #1A1A1A  炭黑       - 卡片背景
████ #F8F8F8  冷白       - 浅色区域背景
████ #E5E5E5  浅灰       - 边框、分隔线
████ #999999  中灰       - 辅助文字
████ #666666  深灰       - 副标题

┌─────────────────────────────────────────────────────────────┐
│            金色点缀（极度克制使用）                           │
└─────────────────────────────────────────────────────────────┘

████ #C9A961  哑光金     - 仅用于：小图标、悬停状态
                         - 不用于大面积
                         - 不用于按钮背景

使用规则：
  ✓ 每个区域最多1处金色
  ✓ 仅作为 accent，不作为主色
  ✓ 优先用细线或小点
```

---

## 📐 重新设计的首页架构

### 整体理念转变

```
之前：内容密集、信息完整、传统企业网站
      ↓
现在：呼吸感强、视觉冲击、艺术画廊感
```

### 新的布局原则

```
1. 极简主义
   - 每屏只有1个核心信息
   - 去除所有装饰性元素
   - 大面积留白

2. 非常规网格
   - 打破传统居中对齐
   - 使用非对称布局
   - 创造视觉张力

3. 视觉叙事
   - 用图片讲故事，少用文字
   - 滚动体验如翻书
   - 每个区域有明确主题

4. 细节精致
   - 微动画无处不在
   - 悬停状态细腻
   - 过渡优雅流畅
```

---

## 🏠 首页 - 重新设计（Mobbin 风格）

### Section 0: 极简导航栏

```
┌──────────────────────────────────────────────────────────┐
│ XIONS                                            CONTACT │
│                                                           │
│           GROUPE    MARQUES    ENGAGEMENTS    FR         │
└──────────────────────────────────────────────────────────┘

特点：
- 高度：80px（更高，更有呼吸感）
- Logo：极简文字 "XIONS"（不用图形logo）
- 导航：极少项目，sans-serif 10px，字母间距 0.2em
- 背景：完全透明，滚动后变为半透明白色
- 分隔：无边框，靠留白分隔
- 悬停：细下划线从中心扩散

技术规格：
.nav {
  height: 80px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
}

.nav-link {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 400;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 0.5px;
  background: #000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}
```

---

### Section 1: Hero - 全屏视觉冲击

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                  IMAGINER                                  │
│                  LA BEAUTÉ                                 │
│                  DE DEMAIN                                 │
│                                                            │
│                                                            │
│                                                            │
│                     ——                                     │
│                                                            │
│                  001 / 007                                 │
│                                                            │
│                                                            │
│  背景：纯白色                                              │
│  文字：纯黑色                                              │
│  无图片，纯字体排版                                        │
│  无按钮，引导滚动                                          │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

设计说明：
❌ 去掉：背景图片、CTA按钮、装饰元素
✅ 保留：纯粹的文字、大量留白、极简符号

技术规格：
.hero {
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 96px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1;
  color: #000000;
  text-align: center;
  margin: 0;
}

.hero h1 span {
  display: block;
}

.hero-divider {
  width: 60px;
  height: 0.5px;
  background: #000000;
  margin: 60px 0 40px;
}

.hero-counter {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #999999;
}

/* 进入动画 */
.hero h1 span:nth-child(1) {
  animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}
.hero h1 span:nth-child(2) {
  animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}
.hero h1 span:nth-child(3) {
  animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Section 2: 集团介绍 - 非对称布局

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│  GROUPE                                                    │
│  ━━━━                                                      │
│                                                            │
│                                                            │
│                        XIONS GROUP est un groupe          │
│                        français indépendant qui           │
│                        crée, développe et déploie         │
│    [大型产品图]        des marques de beauté              │
│    占据左侧60%         premium à l'international.         │
│                                                            │
│                        Notre mission : imaginer           │
│                        la beauté de demain en alliant     │
│                        créativité, rigueur et             │
│                        innovation responsable.            │
│                                                            │
│                                                            │
│                                                    ┌───────┐
│                                                    │   4   │
│                                                    │MARQUES│
│                                                    └───────┘
│                                                            │
│  背景：纯黑 #000000                                        │
│  文字：纯白 #FFFFFF                                        │
│  图片：灰度处理，悬停恢复彩色                              │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

设计说明：
✓ 非对称布局（60/40分割）
✓ 图片左对齐，文字右侧垂直居中
✓ 去掉所有装饰框和边框
✓ 数字卡片放在右下角（小巧、克制）

技术规格：
.group-intro {
  min-height: 100vh;
  background: #000000;
  color: #FFFFFF;
  display: grid;
  grid-template-columns: 60% 40%;
  align-items: center;
  padding: 0;
}

.group-intro-image {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.group-intro-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-intro:hover .group-intro-image img {
  filter: grayscale(0%);
}

.group-intro-content {
  padding: 0 80px 0 60px;
  position: relative;
}

.section-label {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #999999;
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
}

.section-label::after {
  content: '';
  display: block;
  width: 30px;
  height: 0.5px;
  background: #999999;
  margin-top: 8px;
}

.group-intro-content p {
  font-size: 18px;
  line-height: 1.8;
  font-weight: 300;
  color: #CCCCCC;
  margin: 24px 0;
}

.stats-badge {
  position: absolute;
  bottom: -40px;
  right: 80px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  padding: 24px;
  text-align: center;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.3);
}

.stats-badge-number {
  font-size: 48px;
  font-weight: 300;
  color: #FFFFFF;
  line-height: 1;
  margin-bottom: 8px;
}

.stats-badge-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #999999;
}
```

---

### Section 3: 品牌展示 - 全屏滑动

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│  [全屏品牌1 - L'ENTROPISTE]                               │
│                                                            │
│                                   L'ENTROPISTE             │
│                                   PARFUMERIE DE NICHE      │
│                                                            │
│                                   [Découvrir]              │
│                                                            │
│  [大型产品图片，占满屏幕]                                  │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  [全屏品牌2 - SUNLUTION]                                  │
│                                                            │
│  SUNLUTION                                                 │
│  SCIENCE DE LA LUMIÈRE                                     │
│                                                            │
│  [Découvrir]                                               │
│                                                            │
│  [大型产品图片]                                            │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  [依此类推，每个品牌占据100vh]                            │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

设计说明：
❌ 去掉：2x2网格、卡片边框、小尺寸
✅ 改为：每个品牌独立全屏、垂直滚动、沉浸式

Layout Pattern（交替反转）：
Brand 1: 图片左，文字右
Brand 2: 文字左，图片右
Brand 3: 图片左，文字右
Brand 4: 文字左，图片右

技术规格：
.brands-section {
  background: #FFFFFF;
}

.brand-slide {
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

.brand-slide:nth-child(even) {
  grid-template-columns: 1fr 1fr;
  direction: rtl;
}

.brand-slide:nth-child(even) > * {
  direction: ltr;
}

.brand-image {
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.brand-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-slide:hover .brand-image img {
  transform: scale(1.05);
}

.brand-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 120px;
  background: #F8F8F8;
}

.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 72px;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #000000;
  margin: 0 0 16px 0;
  line-height: 0.9;
}

.brand-tagline {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #C9A961; /* 金色，仅此处使用 */
  margin-bottom: 48px;
}

.brand-description {
  font-size: 16px;
  line-height: 1.8;
  color: #666666;
  font-weight: 300;
  max-width: 400px;
  margin-bottom: 48px;
}

.brand-link {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #000000;
  text-decoration: none;
  display: inline-block;
  border-bottom: 0.5px solid #000000;
  padding-bottom: 4px;
  transition: all 0.4s ease;
}

.brand-link:hover {
  padding-bottom: 8px;
  color: #C9A961;
  border-color: #C9A961;
}

/* 滚动进入动画 */
.brand-slide {
  opacity: 0;
}

.brand-slide.in-view {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

---

### Section 4: 核心价值 - 极简列表

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│  ENGAGEMENTS                                               │
│  ━━━━━━━━━━                                               │
│                                                            │
│                                                            │
│  01 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│     EXCELLENCE                                             │
│     L'exigence de qualité dans chaque détail              │
│                                                            │
│                                                            │
│  02 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│     ÉTHIQUE                                                │
│     La transparence et la responsabilité                   │
│                                                            │
│                                                            │
│  03 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│     INNOVATION                                             │
│     La recherche constante de nouvelles solutions          │
│                                                            │
│                                                            │
│  背景：纯白 #FFFFFF                                        │
│  分隔线：细线，悬停变粗                                    │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

设计说明：
❌ 去掉：图标、3栏布局、装饰元素
✅ 改为：简洁列表、编号、横向细线

技术规格：
.values-section {
  min-height: 100vh;
  background: #FFFFFF;
  padding: 160px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #000000;
  margin-bottom: 100px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 0.5px;
  background: #000000;
  margin-top: 12px;
}

.value-item {
  border-top: 0.5px solid #E5E5E5;
  padding: 60px 0;
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 80px;
  transition: border-color 0.6s ease;
  cursor: pointer;
}

.value-item:hover {
  border-top-color: #000000;
}

.value-number {
  font-size: 14px;
  color: #999999;
  font-weight: 300;
}

.value-content h3 {
  font-size: 32px;
  font-weight: 300;
  letter-spacing: -0.01em;
  color: #000000;
  margin: 0 0 16px 0;
}

.value-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #666666;
  font-weight: 300;
  max-width: 600px;
}

/* 悬停动画 */
.value-item:hover .value-number {
  color: #C9A961;
}

.value-item:hover .value-content h3 {
  transform: translateX(8px);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### Section 5: 国际影响力 - 画廊网格

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│  RAYONNEMENT                                               │
│  ━━━━━━━━━━                                               │
│                                                            │
│  ┌──────┐ ┌────────────┐ ┌──────┐                        │
│  │      │ │            │ │      │                        │
│  │      │ │            │ │      │                        │
│  └──────┘ └────────────┘ └──────┘                        │
│                                                            │
│  ┌────────────┐ ┌──────┐ ┌────────────┐                  │
│  │            │ │      │ │            │                  │
│  │            │ │      │ │            │                  │
│  └────────────┘ └──────┘ └────────────┘                  │
│                                                            │
│  ┌──────┐ ┌────────────┐ ┌──────┐                        │
│  │      │ │            │ │      │                        │
│  │      │ │            │ │      │                        │
│  └──────┘ └────────────┘ └──────┘                        │
│                                                            │
│  Masonry 瀑布流布局                                        │
│  黑白照片，悬停彩色 + 标题显示                             │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

技术规格：
.international-section {
  min-height: 100vh;
  background: #0A0A0A;
  padding: 160px 80px;
}

.masonry-grid {
  column-count: 3;
  column-gap: 20px;
  max-width: 1600px;
  margin: 100px auto 0;
}

@media (max-width: 1024px) {
  .masonry-grid { column-count: 2; }
}

@media (max-width: 768px) {
  .masonry-grid { column-count: 1; }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.masonry-item img {
  width: 100%;
  display: block;
  filter: grayscale(100%);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.masonry-item:hover img {
  filter: grayscale(0%);
  transform: scale(1.03);
}

.masonry-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 24px 24px;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  color: #FFFFFF;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.masonry-item:hover .masonry-caption {
  opacity: 1;
  transform: translateY(0);
}
```

---

### Section 6: CTA - 极简呼吁

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│                                                            │
│                                                            │
│                   PRÊT À DÉCOUVRIR                         │
│                   NOS MARQUES ?                            │
│                                                            │
│                   ——————————                               │
│                                                            │
│                   [EXPLORER]                               │
│                                                            │
│                                                            │
│                                                            │
│  背景：纯黑 #000000                                        │
│  文字：纯白 #FFFFFF                                        │
│  按钮：细边框，悬停填充                                    │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

技术规格：
.cta-section {
  min-height: 100vh;
  background: #000000;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
}

.cta-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 64px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0 0 48px 0;
}

.cta-divider {
  width: 120px;
  height: 0.5px;
  background: #FFFFFF;
  margin: 0 auto 48px;
}

.cta-button {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: transparent;
  border: 0.5px solid #FFFFFF;
  padding: 20px 60px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #FFFFFF;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  z-index: -1;
}

.cta-button:hover::before {
  width: 300%;
  height: 600%;
}

.cta-button:hover {
  color: #000000;
}
```

---

### Section 7: Footer - 极简页脚

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                                                            │
│                                                            │
│  XIONS                      Groupe                         │
│                            Marques                         │
│                            Contact                         │
│                                                            │
│  ──────────────────────────────────────────────────────  │
│                                                            │
│  © 2026 XIONS GROUP                    Instagram LinkedIn │
│                                                            │
│                                                            │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

技术规格：
.footer {
  background: #FFFFFF;
  padding: 100px 80px 60px;
  border-top: 0.5px solid #E5E5E5;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 80px;
}

.footer-logo {
  font-size: 18px;
  letter-spacing: 0.2em;
  font-weight: 300;
  color: #000000;
}

.footer-links a {
  display: block;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #666666;
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #000000;
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #999999;
  letter-spacing: 0.1em;
}

.footer-social a {
  color: #999999;
  margin-left: 24px;
  transition: color 0.3s ease;
}

.footer-social a:hover {
  color: #000000;
}
```

---

## 🎬 高级动画效果（Mobbin 风格）

### 1. Smooth Scroll（平滑滚动）

```javascript
// 使用 Lenis 库实现黄油般的滚动
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```

### 2. Magnetic Buttons（磁性按钮）

```javascript
// 按钮跟随鼠标移动
const buttons = document.querySelectorAll('.cta-button')

buttons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  })
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)'
  })
})
```

### 3. Text Reveal（文字揭示动画）

```javascript
// 使用 SplitType 分割文字，逐字淡入
import SplitType from 'split-type'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const titles = document.querySelectorAll('h1, h2, .brand-name')

titles.forEach(title => {
  const split = new SplitType(title, { types: 'chars' })
  
  gsap.from(split.chars, {
    opacity: 0,
    y: 50,
    rotateX: -90,
    stagger: 0.03,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: title,
      start: 'top 80%',
    }
  })
})
```

### 4. Image Parallax（图片视差）

```javascript
// 图片滚动时轻微移动
gsap.utils.toArray('.brand-image img').forEach(img => {
  gsap.to(img, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  })
})
```

### 5. Cursor Follower（自定义光标）

```javascript
// 大圆形跟随光标
const cursor = document.createElement('div')
cursor.className = 'custom-cursor'
document.body.appendChild(cursor)

let mouseX = 0, mouseY = 0
let cursorX = 0, cursorY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1
  cursorY += (mouseY - cursorY) * 0.1
  
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
  
  requestAnimationFrame(animateCursor)
}

animateCursor()
```

```css
.custom-cursor {
  width: 40px;
  height: 40px;
  border: 0.5px solid #000;
  border-radius: 50%;
  position: fixed;
  top: -20px;
  left: -20px;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: width 0.3s, height 0.3s;
}

a:hover ~ .custom-cursor,
button:hover ~ .custom-cursor {
  width: 80px;
  height: 80px;
}

body {
  cursor: none;
}

a, button {
  cursor: none;
}
```

---

## 📱 移动端适配原则

```
桌面端：沉浸式、大图、视差、复杂动画
        ↓
移动端：简洁、垂直、快速、基础动画

适配策略：
1. 图片：桌面横屏 → 移动竖屏全宽
2. 文字：桌面大字号 → 移动适中字号
3. 动画：桌面完整 → 移动简化（减少性能消耗）
4. 布局：桌面分栏 → 移动单栏堆叠
5. 光标：桌面自定义 → 移动恢复默认
```

---

## 🎯 设计检查清单

### 极简主义检查

- [ ] 每个区域只有1个核心信息
- [ ] 去除所有装饰性图标
- [ ] 颜色不超过3种（黑/白/金）
- [ ] 字体不超过2种（serif + sans-serif）
- [ ] 按钮极少，最多2个
- [ ] 无渐变色（除了图片遮罩）
- [ ] 分隔线极细（0.5px）

### 留白检查

- [ ] 导航栏高度至少80px
- [ ] 区块上下至少100px padding
- [ ] 文字行高至少1.6
- [ ] 元素间距至少40px
- [ ] Hero 区域100vh无内容挤压

### 细节检查

- [ ] 所有过渡时间>0.3s（优雅）
- [ ] 使用 cubic-bezier 缓动
- [ ] 悬停状态细腻（边框、位移、颜色）
- [ ] 图片黑白→彩色过渡
- [ ] 文字淡入动画逐字进行
- [ ] 无生硬的 ease-in-out

### 一致性检查

- [ ] 字母间距统一（标签0.2-0.3em）
- [ ] 边框粗细统一（0.5px）
- [ ] 按钮高度统一
- [ ] Section 标签样式统一
- [ ] 悬停效果统一

---

## 🚀 技术实现优先级

### Phase 1 - 骨架（1天）

```
□ Astro 项目结构
□ 黑白配色系统
□ 字体加载（Cormorant + Inter）
□ 基础组件（Nav, Footer）
□ 响应式网格系统
```

### Phase 2 - 首页核心（2天）

```
□ Hero 区域（纯文字版）
□ 集团介绍（非对称布局）
□ 品牌展示（全屏滑动）
□ 基础动画（淡入、滚动触发）
```

### Phase 3 - 完善细节（2天）

```
□ 核心价值列表
□ 国际影响力 Masonry
□ CTA 区域
□ 高级动画（GSAP）
□ Smooth Scroll
```

### Phase 4 - 优化（1天）

```
□ 图片懒加载
□ 性能优化
□ 移动端适配
□ 浏览器测试
```

---

## 💡 关键差异总结

### 之前的设计 vs 现在的设计

```
┌─────────────────┬──────────────────┬──────────────────┐
│     元素        │    之前          │      现在        │
├─────────────────┼──────────────────┼──────────────────┤
│ Hero背景        │ 大图片+文字      │ 纯白+大字体      │
│ 品牌展示        │ 2x2网格卡片      │ 全屏滚动         │
│ 配色            │ 金色主要色       │ 金色仅点缀       │
│ 留白            │ 适中             │ 极大             │
│ 动画            │ 标准             │ 细腻+高级        │
│ 按钮            │ 多个实心按钮     │ 极少细边框       │
│ 图标            │ 装饰图标         │ 无图标           │
│ 网格            │ 规则对齐         │ 非对称+打破      │
│ 字体大小        │ 适中             │ 极大或极小       │
│ 边框            │ 1-2px            │ 0.5px 细线       │
│ 图片            │ 彩色             │ 黑白→悬停彩色    │
└─────────────────┴──────────────────┴──────────────────┘
```

---

## 🎨 最终效果预期

```
视觉感受：
✓ 第一眼：简洁、高级、有距离感
✓ 浏览时：沉浸、优雅、细节丰富
✓ 互动后：惊喜、流畅、专业

品牌调性：
✓ 不喧哗而自有力量
✓ 克制中展现品质
✓ 极简不等于简陋
✓ 细节体现专业

用户体验：
✓ 滚动如丝般顺滑
✓ 每个互动有反馈
✓ 视觉引导清晰
✓ 加载速度极快
```

---

**准备好按照这个新设计开始编码了吗？** 

这个设计更符合：
- ✅ Mobbin 上高端品牌的风格
- ✅ 黑白主调，极度克制
- ✅ 调性十足，细节精致
- ✅ 现代、优雅、专业

告诉我你的想法，或者我现在就开始实现！🎨
