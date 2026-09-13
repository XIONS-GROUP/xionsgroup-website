# XIONS GROUP 首页详细规划

## 🎯 首页目标

**核心目标**：
1. 展现 XIONS GROUP 作为高端美妆集团的品牌形象
2. 快速传递"创新、品质、国际化"的核心价值
3. 引导访客深入了解各个品牌
4. 建立信任感和专业度
5. SEO 优化，提升搜索引擎排名

**目标访客**：
- 🛍️ 潜在消费者（寻找高端美妆产品）
- 🤝 合作伙伴（零售商、经销商）
- 📰 媒体和行业分析师
- 💼 求职者
- 💰 潜在投资者

---

## 📐 首页布局架构（详细版）

```
┌─────────────────────────────────────────────────────────┐
│ Section 0: NAVIGATION BAR                                │
│ 固定导航 - 60px 高度                                     │
└─────────────────────────────────────────────────────────┘
│ Section 1: HERO                                          │
│ 全屏视觉冲击 - 100vh                                     │
└─────────────────────────────────────────────────────────┘
│ Section 2: GROUP INTRO                                   │
│ 集团简介 - 600px 高度                                    │
└─────────────────────────────────────────────────────────┘
│ Section 3: BRANDS SHOWCASE                               │
│ 品牌展示 - 动态高度                                      │
└─────────────────────────────────────────────────────────┘
│ Section 4: VALUES & COMMITMENTS                          │
│ 核心价值 - 500px 高度                                    │
└─────────────────────────────────────────────────────────┘
│ Section 5: INTERNATIONAL PRESENCE                        │
│ 国际影响力 - 700px 高度                                  │
└─────────────────────────────────────────────────────────┘
│ Section 6: CALL TO ACTION                                │
│ 行动召唤 - 400px 高度                                    │
└─────────────────────────────────────────────────────────┘
│ Section 7: FOOTER                                        │
│ 页脚 - 300px 高度                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Section 0: NAVIGATION BAR（导航栏）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│ [XIONS GROUP Logo]              [Group] [Marques] [...] │
│                                            [FR ▾] [🔍]    │
└──────────────────────────────────────────────────────────┘

特点：
- 背景：半透明黑色（rgba(0,0,0,0.8)）
- 滚动后：完全实心黑色 + 阴影
- 高度：60px
- 固定在顶部（position: fixed）
- z-index: 1000
```

### 功能规格

**左侧：Logo**
```html
<a href="/fr">
  <img src="logo-white.svg" alt="XIONS GROUP" height="40">
</a>

- Logo 颜色：白色
- 悬停效果：轻微放大（scale: 1.05）
- 过渡：300ms ease
```

**中间：主导航菜单**
```
导航项：
├── Groupe（集团） → /fr/groupe
├── Marques（品牌） → /fr/marques
│   ├── L'Entropiste → /fr/marques/lentropiste
│   ├── Sunlution → /fr/marques/sunlution
│   ├── Masqly → /fr/marques/masqly
│   └── Betenoir → /fr/marques/betenoir
├── Engagements（承诺） → /fr/engagements
├── Rayonnement（影响力） → /fr/rayonnement
├── Carrières（招聘） → /fr/carrieres
└── Contact → /fr/contact

样式：
- 字体：16px, 字重 400
- 颜色：白色（#FFFFFF）
- 间距：32px 之间
- 悬停：下划线动画（从左到右）
- 当前页：粗体 + 金色下划线
```

**右侧：语言选择 + 搜索**
```
语言切换：
[FR ▾] ← 下拉菜单
└── EN (Coming soon - 灰色)

搜索图标（可选）：
[🔍] → 点击展开搜索框（可选功能）
```

**移动端导航（<768px）**
```
[Logo]                    [☰ 汉堡菜单]

点击汉堡菜单：
全屏覆盖导航
- 背景：黑色半透明
- 动画：从右侧滑入
- 关闭：点击 [✕] 或背景
```

---

## 🎨 Section 1: HERO（英雄区）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│              IMAGINER LA BEAUTÉ                            │
│                   DE DEMAIN                                │
│                                                            │
│            [ Découvrir nos marques ]                       │
│                                                            │
│                      ↓ 滚动提示                            │
│                                                            │
│  [全屏高质感背景图片 - 美妆产品或抽象艺术]                │
└──────────────────────────────────────────────────────────┘

尺寸：100vh（全屏高度）
背景：渐变叠加 + 背景图
```

### 技术规格

**背景层**
```css
.hero {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-image: 
    linear-gradient(
      rgba(0, 0, 0, 0.4), 
      rgba(0, 0, 0, 0.3)
    ),
    url('/images/hero-bg.jpg');
  
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 视差效果 */
}
```

**标题文字**
```html
<h1>
  IMAGINER LA BEAUTÉ<br>
  DE DEMAIN
</h1>

样式：
- 字体：Serif（如 Cormorant Garamond, Playfair Display）
- 大小：64px (桌面) / 42px (移动)
- 颜色：白色 #FFFFFF
- 字重：300 (Light)
- 字母间距：0.05em
- 行高：1.2
- 文字对齐：居中
- 文字阴影：0 2px 8px rgba(0,0,0,0.5)
- 动画：淡入 + 向上滑动（1s ease-out）
```

**CTA 按钮**
```html
<a href="/fr/marques" class="hero-cta">
  Découvrir nos marques
</a>

样式：
- 边框：2px 白色实线
- 背景：透明
- 内边距：16px 48px
- 颜色：白色
- 字体：14px, 字重 500, 字母间距 0.1em
- 圆角：0（方形设计）
- 过渡：all 0.3s ease

悬停效果：
- 背景：白色
- 颜色：黑色
- 向上位移：translateY(-2px)
- 阴影：0 8px 16px rgba(255,255,255,0.2)

动画：
- 延迟 0.5s 后淡入
```

**滚动提示**
```html
<div class="scroll-indicator">
  ↓
</div>

样式：
- 位置：绝对定位，底部 40px
- 动画：上下浮动（无限循环）
- 颜色：白色，半透明
- 字体：24px
```

### 背景图片建议

**选项 1：产品特写**
- 高端香水瓶（L'Entropiste）
- 模糊背景，产品清晰
- 专业摄影棚光线

**选项 2：抽象艺术**
- 流动的液体纹理
- 金色/粉色/白色渐变
- 高端奢华感

**选项 3：品牌元素**
- 多个品牌产品的艺术排列
- 俯视视角
- 极简背景

**图片要求**：
- 分辨率：至少 2560x1440px
- 格式：WebP（现代浏览器）+ JPG（回退）
- 大小：< 500KB（压缩后）
- 焦点：中心（确保文字区域清晰）

---

## 🎨 Section 2: GROUP INTRO（集团简介）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                         XIONS GROUP                        │
│              Un groupe indépendant nouvelle génération     │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  [左侧文字]                           [右侧数字展示]      │
│                                                            │
│  XIONS GROUP est un groupe                    4           │
│  français indépendant qui                  MARQUES         │
│  crée, développe et déploie                                │
│  des marques de beauté                       3             │
│  premium à l'international.              FONDATEURS        │
│                                                            │
│  Notre mission : imaginer                  20+            │
│  la beauté de demain en                   PAYS            │
│  alliant créativité, rigueur                               │
│  et innovation responsable.              2026             │
│                                         CRÉATION          │
│                                                            │
│              [ En savoir plus sur le Groupe ]              │
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：白色或极浅灰（#FAFAFA）
内边距：120px 上下
```

### 技术规格

**区块标题**
```html
<h2>XIONS GROUP</h2>
<p class="subtitle">Un groupe indépendant nouvelle génération</p>

样式 h2：
- 字体：Sans-serif（如 Inter, Helvetica Neue）
- 大小：48px
- 颜色：黑色 #000000
- 字重：700
- 字母间距：-0.02em
- 文字对齐：居中
- 动画：滚动时淡入

样式 subtitle：
- 字体：同上
- 大小：20px
- 颜色：深灰 #333333
- 字重：300
- 文字对齐：居中
- 上边距：16px
```

**内容布局（两栏）**
```css
.group-intro-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 80px;
  max-width: 1200px;
  margin: 80px auto 0;
}

@media (max-width: 768px) {
  .group-intro-content {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}
```

**左侧：文字内容**
```html
<div class="intro-text">
  <p>
    XIONS GROUP est un groupe français indépendant qui crée, 
    développe et déploie des marques de beauté premium à 
    l'international.
  </p>
  <p>
    Notre mission : imaginer la beauté de demain en alliant 
    créativité, rigueur et innovation responsable.
  </p>
</div>

样式：
- 字体：18px
- 行高：1.8
- 颜色：深灰 #2A2A2A
- 字重：400
- 段落间距：24px
```

**右侧：数字展示**
```html
<div class="stats">
  <div class="stat-item">
    <div class="stat-number">4</div>
    <div class="stat-label">MARQUES</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">3</div>
    <div class="stat-label">FONDATEURS</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">20+</div>
    <div class="stat-label">PAYS</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">2026</div>
    <div class="stat-label">CRÉATION</div>
  </div>
</div>

样式：
- 布局：垂直排列，均匀间距
- 每个 stat-item 间距：40px

.stat-number：
- 字体：72px
- 颜色：金色 #D4AF37 或黑色 #000000
- 字重：700
- 动画：滚动时数字滚动效果（countUp.js）

.stat-label：
- 字体：12px
- 颜色：深灰 #666666
- 字重：600
- 字母间距：0.15em
- 上边距：8px
```

**CTA 按钮**
```html
<a href="/fr/groupe" class="btn-secondary">
  En savoir plus sur le Groupe
</a>

样式：
- 背景：黑色 #000000
- 颜色：白色
- 内边距：14px 40px
- 字体：14px, 字重 500
- 圆角：0
- 显示：块级，居中
- 最大宽度：300px
- 上边距：60px

悬停：
- 背景：深灰 #2A2A2A
- 向右轻微位移：translateX(4px)
```

---

## 🎨 Section 3: BRANDS SHOWCASE（品牌展示）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                      NOS MARQUES                           │
│          Quatre univers, une même exigence d'excellence    │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │                 │  │                 │                │
│  │  L'ENTROPISTE   │  │   SUNLUTION     │                │
│  │                 │  │                 │                │
│  │  [品牌图片]    │  │  [品牌图片]    │                │
│  │                 │  │                 │                │
│  │ Parfumerie de   │  │ Science de la   │                │
│  │ niche           │  │ lumière         │                │
│  │                 │  │                 │                │
│  │ [Découvrir]     │  │ [Découvrir]     │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │                 │  │                 │                │
│  │    MASQLY       │  │   BETENOIR      │                │
│  │                 │  │                 │                │
│  │  [品牌图片]    │  │  [Coming Soon]  │                │
│  │                 │  │                 │                │
│  │ Les zones       │  │ Mystère et      │                │
│  │ oubliées        │  │ sophistication  │                │
│  │                 │  │                 │                │
│  │ [Découvrir]     │  │ [...]           │                │
│  └─────────────────┘  └─────────────────┘                │
│                                                            │
│              [ Découvrir toutes nos marques ]              │
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：深灰或黑色 (#0A0A0A)
文字：白色
内边距：120px 上下
```

### 技术规格

**区块标题**
```html
<h2>NOS MARQUES</h2>
<p class="subtitle">
  Quatre univers, une même exigence d'excellence
</p>

样式：
- h2: 48px, 白色, 字重 700, 居中
- subtitle: 20px, 浅灰 #CCCCCC, 字重 300, 居中
- 上述样式与 Section 2 保持一致但颜色反转
```

**品牌卡片网格**
```css
.brands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 80px auto 0;
}

@media (max-width: 1024px) {
  .brands-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}
```

**单个品牌卡片**
```html
<article class="brand-card">
  <div class="brand-image">
    <img src="/images/brands/lentropiste.jpg" alt="L'Entropiste">
  </div>
  <div class="brand-content">
    <h3 class="brand-name">L'ENTROPISTE</h3>
    <p class="brand-tagline">Parfumerie de niche</p>
    <p class="brand-description">
      Une maison de parfum d'art qui célèbre l'audace créative 
      et l'excellence artisanale.
    </p>
    <a href="/fr/marques/lentropiste" class="brand-link">
      Découvrir L'Entropiste →
    </a>
  </div>
</article>

样式：
.brand-card：
- 背景：深灰 #1A1A1A
- 内边距：0（图片全宽）
- 边框：1px 透明
- 过渡：all 0.4s ease
- 悬停：边框变为金色 #D4AF37
- 悬停：轻微上浮 translateY(-8px)
- 悬停：阴影加深

.brand-image：
- 高度：320px
- 宽度：100%
- overflow: hidden
- 图片：object-fit: cover
- 悬停时图片：scale(1.05)

.brand-content：
- 内边距：40px
- 背景：渐变（从透明到黑色）

.brand-name：
- 字体：24px
- 颜色：白色
- 字重：600
- 字母间距：0.05em
- 上边距：0

.brand-tagline：
- 字体：14px
- 颜色：金色 #D4AF37
- 字重：500
- 字母间距：0.1em
- 上边距：8px
- 文本转换：大写

.brand-description：
- 字体：16px
- 颜色：浅灰 #CCCCCC
- 行高：1.6
- 上边距：16px

.brand-link：
- 字体：14px
- 颜色：白色
- 字重：500
- 上边距：24px
- 显示：inline-block
- 悬停：金色 #D4AF37
- 悬停：向右位移 translateX(4px)
```

**BETENOIR 特殊卡片（Coming Soon）**
```html
<article class="brand-card brand-card--coming-soon">
  <div class="brand-image brand-image--blurred">
    <img src="/images/brands/betenoir-teaser.jpg" alt="Betenoir">
    <div class="coming-soon-overlay">
      <span>BIENTÔT RÉVÉLÉ</span>
    </div>
  </div>
  <div class="brand-content">
    <h3 class="brand-name">BETENOIR</h3>
    <p class="brand-tagline">Coming Soon</p>
    <p class="brand-description">
      Un nouveau chapitre s'écrit. Mystère et sophistication.
    </p>
  </div>
</article>

特殊样式：
- 图片：blur(10px) + 暗化
- overlay：半透明黑色
- "BIENTÔT RÉVÉLÉ"：大字，居中
- 无链接按钮
- 卡片悬停：只有轻微阴影（无上浮）
```

---

## 🎨 Section 4: VALUES & COMMITMENTS（核心价值）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                    NOS ENGAGEMENTS                         │
│              Les valeurs qui nous guident                  │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│    [图标]            [图标]            [图标]             │
│                                                            │
│  EXCELLENCE       ÉTHIQUE         INNOVATION              │
│                                                            │
│  L'exigence de    La transparence  La recherche           │
│  qualité dans     et la            constante de           │
│  chaque détail    responsabilité   nouvelles solutions    │
│                   dans nos actions                         │
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：白色或极浅灰
内边距：100px 上下
```

### 技术规格

**三栏布局**
```css
.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  max-width: 1200px;
  margin: 80px auto 0;
}

@media (max-width: 768px) {
  .values-grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }
}
```

**单个价值卡片**
```html
<div class="value-item">
  <div class="value-icon">
    <svg>...</svg> <!-- 或图标字体 -->
  </div>
  <h3 class="value-title">EXCELLENCE</h3>
  <p class="value-description">
    L'exigence de qualité dans chaque détail
  </p>
</div>

样式：
.value-item：
- 文字对齐：居中
- 动画：滚动时从下方淡入

.value-icon：
- 大小：80px
- 颜色：金色 #D4AF37 或黑色
- 边距：0 auto 24px
- 动画：悬停时旋转或缩放

.value-title：
- 字体：20px
- 颜色：黑色
- 字重：600
- 字母间距：0.1em
- 上边距：24px

.value-description：
- 字体：16px
- 颜色：深灰 #666666
- 行高：1.6
- 上边距：16px
```

**图标建议**：
- Excellence：✧ 星形或钻石
- Éthique：⚖ 天平或握手
- Innovation：💡 灯泡或原子

---

## 🎨 Section 5: INTERNATIONAL PRESENCE（国际影响力）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                  RAYONNEMENT INTERNATIONAL                 │
│               Des marques françaises, une présence globale │
│                                                            │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  [照片画廊 - 国际活动和城市]                              │
│                                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Cannes │ │ Oscars │ │  NYC   │ │  LA    │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
│                                                            │
│        PARIS · LOS ANGELES · NEW YORK · LONDON ·          │
│          SHANGHAI · HONG KONG · DUBAI · TOKYO             │
│                                                            │
│            [ Découvrir notre rayonnement ]                 │
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：中灰 #F5F5F5
内边距：120px 上下
```

### 技术规格

**照片画廊（Masonry 布局或滑动轮播）**
```css
/* Option 1: 滑动轮播 */
.international-carousel {
  width: 100%;
  max-width: 1400px;
  margin: 60px auto;
  position: relative;
}

/* Option 2: Masonry 网格 */
.international-gallery {
  columns: 4;
  column-gap: 20px;
  max-width: 1400px;
  margin: 60px auto;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-item img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-item::after {
  content: attr(data-caption);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 40px 20px 20px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover::after {
  opacity: 1;
}
```

**城市列表（滚动动画）**
```html
<div class="cities-marquee">
  <div class="cities-track">
    PARIS · LOS ANGELES · NEW YORK · LONDON · 
    SHANGHAI · HONG KONG · DUBAI · TOKYO
  </div>
</div>

样式：
- 字体：16px
- 颜色：深灰 #2A2A2A
- 字重：500
- 字母间距：0.15em
- 动画：无限水平滚动（CSS animation）
- 持续时间：30s
- 缓动：linear
```

---

## 🎨 Section 6: CALL TO ACTION（行动召唤）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                                                            │
│             PRÊT À DÉCOUVRIR NOS MARQUES ?                 │
│                                                            │
│          Explorez l'univers unique de chaque création      │
│                                                            │
│            [ Découvrir les marques ]  [ Nous contacter ]   │
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：渐变（深蓝到黑色）或纯色
内边距：100px 上下
文字：白色，居中
```

### 技术规格

```html
<section class="cta-section">
  <h2>PRÊT À DÉCOUVRIR NOS MARQUES ?</h2>
  <p class="cta-subtitle">
    Explorez l'univers unique de chaque création
  </p>
  <div class="cta-buttons">
    <a href="/fr/marques" class="btn-primary">
      Découvrir les marques
    </a>
    <a href="/fr/contact" class="btn-secondary-outline">
      Nous contacter
    </a>
  </div>
</section>

样式：
.cta-section：
- 背景：linear-gradient(135deg, #1a1a2e 0%, #0f0f0f 100%)
- 文字对齐：居中
- 内边距：100px 20px

h2：
- 字体：42px
- 颜色：白色
- 字重：700

.cta-subtitle：
- 字体：18px
- 颜色：浅灰 #CCCCCC
- 上边距：16px

.cta-buttons：
- 显示：flex
- 间距：24px
- 居中对齐
- 上边距：48px

.btn-primary：
- 背景：金色 #D4AF37
- 颜色：黑色
- 内边距：16px 48px
- 字体：14px, 字重 600
- 圆角：0
- 悬停：背景变亮

.btn-secondary-outline：
- 背景：透明
- 边框：2px 白色
- 颜色：白色
- 内边距：14px 46px
- 悬停：背景白色，颜色黑色
```

---

## 🎨 Section 7: FOOTER（页脚）

### 视觉设计
```
┌──────────────────────────────────────────────────────────┐
│                                                            │
│  [XIONS GROUP Logo]                                        │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Groupe   │  │ Marques  │  │ Suivez-  │  │ Contact  │ │
│  │          │  │          │  │  nous    │  │          │ │
│  │ À propos │  │L'Entropis│  │ Instagram│  │ Email    │ │
│  │ Équipe   │  │Sunlution │  │ LinkedIn │  │ Presse   │ │
│  │ Carrières│  │ Masqly   │  │ Facebook │  │          │ │
│  │          │  │ Betenoir │  │          │  │          │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  © 2026 XIONS GROUP. Tous droits réservés.                │
│  Mentions légales · Politique de confidentialité · Cookies│
│                                                            │
└──────────────────────────────────────────────────────────┘

背景：黑色 #000000
文字：白色/灰色
内边距：80px 上下
```

### 技术规格

```css
.footer {
  background: #000000;
  color: #FFFFFF;
  padding: 80px 20px 40px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto 60px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

.footer-column h4 {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
  color: #FFFFFF;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin-bottom: 12px;
}

.footer-column a {
  color: #CCCCCC;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #D4AF37; /* 金色 */
}

.footer-bottom {
  border-top: 1px solid #333333;
  padding-top: 30px;
  text-align: center;
  font-size: 13px;
  color: #999999;
}

.footer-bottom a {
  color: #999999;
  margin: 0 12px;
}

.footer-bottom a:hover {
  color: #FFFFFF;
}
```

---

## 🎬 动画和交互效果

### 页面加载动画
```javascript
// Hero 区域淡入
gsap.from('.hero h1', {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power3.out'
});

gsap.from('.hero-cta', {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.5,
  ease: 'power3.out'
});
```

### 滚动触发动画
```javascript
// 使用 Intersection Observer
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.brand-card, .value-item, .stat-item')
  .forEach(el => observer.observe(el));
```

### CSS 动画类
```css
.animate-in {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 数字滚动效果 */
.stat-number {
  animation: countUp 2s ease-out forwards;
}

/* 视差效果（仅桌面） */
@media (min-width: 1024px) {
  .hero {
    background-attachment: fixed;
  }
}
```

---

## 📱 响应式断点

```css
/* 移动端（小屏手机） */
@media (max-width: 480px) {
  .hero h1 { font-size: 36px; }
  .brands-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: 1fr; }
}

/* 移动端（大屏手机） */
@media (max-width: 768px) {
  .nav-menu { display: none; } /* 显示汉堡菜单 */
  .group-intro-content { grid-template-columns: 1fr; }
  .footer-content { grid-template-columns: 1fr 1fr; }
}

/* 平板端 */
@media (max-width: 1024px) {
  .hero h1 { font-size: 52px; }
  .brands-grid { grid-template-columns: 1fr; }
}

/* 桌面端 */
@media (min-width: 1025px) {
  /* 启用完整动画效果 */
  .enable-parallax { ... }
}

/* 超大屏幕 */
@media (min-width: 1920px) {
  .container { max-width: 1600px; }
}
```

---

## ⚡ 性能优化

### 图片优化
```html
<!-- 响应式图片 -->
<picture>
  <source 
    srcset="/images/hero-bg.webp" 
    type="image/webp"
  >
  <source 
    srcset="/images/hero-bg.jpg" 
    type="image/jpeg"
  >
  <img 
    src="/images/hero-bg.jpg" 
    alt="XIONS GROUP"
    loading="lazy"
  >
</picture>

<!-- 不同尺寸 -->
<img
  src="/images/brand-sm.jpg"
  srcset="
    /images/brand-sm.jpg 600w,
    /images/brand-md.jpg 1200w,
    /images/brand-lg.jpg 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Brand"
  loading="lazy"
>
```

### 代码分割
```javascript
// 动态导入重型库
const loadGSAP = async () => {
  if (window.innerWidth >= 1024) {
    const gsap = await import('gsap');
    // 初始化动画
  }
};
```

### 关键 CSS 内联
```html
<head>
  <style>
    /* 关键 CSS（首屏） */
    .hero { ... }
    .nav { ... }
  </style>
  <link rel="preload" href="/styles/main.css" as="style">
  <link rel="stylesheet" href="/styles/main.css">
</head>
```

---

## 🔍 SEO 优化

### Meta 标签
```html
<head>
  <title>XIONS GROUP — Groupe de beauté premium français</title>
  <meta name="description" content="XIONS GROUP est un groupe français indépendant qui crée, développe et déploie des marques de beauté premium à l'international. Découvrez L'Entropiste, Sunlution, Masqly et Betenoir.">
  
  <!-- Open Graph -->
  <meta property="og:title" content="XIONS GROUP — Groupe de beauté premium français">
  <meta property="og:description" content="Un groupe indépendant nouvelle génération">
  <meta property="og:image" content="/images/og-image.jpg">
  <meta property="og:url" content="https://xionsgroup.com/fr">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="XIONS GROUP">
  <meta name="twitter:description" content="Groupe de beauté premium français">
  <meta name="twitter:image" content="/images/twitter-card.jpg">
  
  <!-- 结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "XIONS GROUP",
    "url": "https://xionsgroup.com",
    "logo": "https://xionsgroup.com/logo.png",
    "description": "Groupe français indépendant de beauté premium",
    "foundingDate": "2026",
    "founders": [
      {
        "@type": "Person",
        "name": "Denis Bellaïche"
      },
      {
        "@type": "Person",
        "name": "Kris Fang"
      },
      {
        "@type": "Person",
        "name": "Neo Su"
      }
    ],
    "brand": [
      {
        "@type": "Brand",
        "name": "L'Entropiste",
        "url": "https://lentropiste.com"
      },
      {
        "@type": "Brand",
        "name": "Sunlution",
        "url": "https://sunlution.com"
      },
      {
        "@type": "Brand",
        "name": "Masqly",
        "url": "https://masqly.com"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@xionsgroup.com",
      "contactType": "customer service"
    }
  }
  </script>
</head>
```

---

## ✅ 首页开发检查清单

### 设计阶段
- [ ] 确认配色方案
- [ ] 选择字体（主标题 + 正文）
- [ ] 收集所有必需图片
  - [ ] Hero 背景图
  - [ ] L'Entropiste 品牌图
  - [ ] Sunlution 品牌图
  - [ ] Masqly 品牌图
  - [ ] Betenoir 预告图
  - [ ] 国际活动照片（8-12张）
- [ ] 确认品牌官网链接
- [ ] 创建图标（Excel lence/Éthique/Innovation）

### 开发阶段
- [ ] 创建 Astro 页面结构
- [ ] 实现导航栏（桌面 + 移动）
- [ ] 实现 Hero 区域
- [ ] 实现集团简介区域
- [ ] 实现品牌展示区域
- [ ] 实现核心价值区域
- [ ] 实现国际影响力区域
- [ ] 实现 CTA 区域
- [ ] 实现 Footer
- [ ] 添加页面过渡动画
- [ ] 添加滚动触发动画
- [ ] 实现响应式布局

### 测试阶段
- [ ] 桌面端测试（Chrome/Firefox/Safari）
- [ ] 移动端测试（iOS Safari/Chrome）
- [ ] 平板端测试
- [ ] 性能测试（Lighthouse）
  - [ ] Performance > 90
  - [ ] Accessibility > 95
  - [ ] Best Practices > 95
  - [ ] SEO > 95
- [ ] 图片加载测试（懒加载）
- [ ] 表单测试（如有）
- [ ] 链接测试（所有链接正常）
- [ ] SEO 检查（meta 标签）

### 上线前
- [ ] 压缩所有图片
- [ ] 生成 sitemap.xml
- [ ] 生成 robots.txt
- [ ] 配置 404 页面
- [ ] 添加 Google Analytics（可选）
- [ ] 测试 Netlify 部署
- [ ] DNS 配置测试

---

## 📝 需要你提供的内容

1. **高质量图片**：
   - Hero 背景图（2560x1440px 最小）
   - 4个品牌的代表图片
   - 国际活动照片
   
2. **品牌信息**：
   - 各品牌官网 URL
   - 简短描述（如需调整）
   
3. **法律信息**：
   - 完整公司地址
   - SIREN/SIRET
   - TVA 号码

4. **Logo 文件**：
   - 白色版本（导航栏用）
   - 黑色版本（页脚用）
   - SVG 格式（矢量）

5. **其他**：
   - 社交媒体链接（Instagram, LinkedIn 等）
   - 联系邮箱确认
   - 电话号码（如显示）

---

**准备好开始了吗？我可以立即开始编码！** 🚀

告诉我：
1. 你想先看首页的实际代码？
2. 还是先提供图片和内容？
3. 或者我们先做一个简化版本快速上线？
