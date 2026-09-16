import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const visuals = JSON.parse(await fs.readFile(path.join(root,'src/data/visuals.json'),'utf8'));
const out = path.join(root,'local-materials/visual-kit');
await fs.mkdir(out,{recursive:true});
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
// Pack five columns, using the tallest item in each row. Keep Illustrator's
// normal canvas within 16,383 points; one point is one exported pixel at 72 ppi.
const boards=[]; let y=0;
for(let i=0;i<visuals.length;i+=5){
  const row=visuals.slice(i,i+5); let x=0;
  for(const v of row){boards.push({...v,x,y});x+=v.width+180;}
  y+=Math.max(...row.map(v=>v.height))+180;
}
const width=Math.max(...boards.map(v=>v.x+v.width));
const height=Math.max(...boards.map(v=>v.y+v.height));
if(width>16000||height>16000) throw new Error('Artboard canvas exceeds standard Illustrator bounds');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}">\n${boards.map(v=>`<g id="${v.name}" transform="translate(${v.x} ${v.y})"><title>${escape(v.name)}</title><rect width="${v.width}" height="${v.height}" fill="white"/></g>`).join('\n')}\n</svg>`;
await fs.writeFile(path.join(out,'xionsgroup-named-groups.svg'),svg);
const data=JSON.stringify(boards.map((v,index)=>({
  index:index + 1,
  name:v.name,
  x:v.x-width/2,
  y:height/2-v.y,
  w:v.width,
  h:v.height,
  type:v.id.endsWith('-logo') ? 'SVG / transparent PNG' : v.id === 'site-icon' ? 'PNG' : 'JPG',
  page:v.page
})));
const jsx=`#target illustrator
/*
  XIONS GROUP — website visual artboards
  Generated from src/data/visuals.json on ${new Date().toISOString().slice(0,10)}.
  This script creates a NEW RGB document with ${visuals.length} native Illustrator artboards.
  It does not open, edit, overwrite, or save an existing Illustrator file.

  Each artboard name is the exact website delivery filename without its extension.
  Export at 1x and enable “Use Artboards” to retain the required pixel dimensions.
*/
(function () {
  var boards = ${data};
  var doc = app.documents.add(DocumentColorSpace.RGB, boards[0].w, boards[0].h);

  for (var i = 0; i < boards.length; i++) {
    var spec = boards[i];
    var rect = [spec.x, spec.y, spec.x + spec.w, spec.y - spec.h];
    var artboard = i === 0 ? doc.artboards[0] : doc.artboards.add(rect);
    artboard.artboardRect = rect;
    artboard.name = spec.name;
  }

  doc.artboards.setActiveArtboardIndex(0);
  alert('Created ' + boards.length + ' XIONS GROUP artboards.\\n\\nSave this new file as an .ai master, add visuals, then export at 1x with Use Artboards.');
}());
`;
await fs.writeFile(path.join(out,'create-xionsgroup-web-artboards.jsx'),jsx);
const artboardList=`# Illustrator artboard index\n\nGenerated from the website visual manifest. The script creates these ${visuals.length} native artboards in this order.\n\n| # | Artboard name / output filename | Pixels | Format | Website page |\n| ---: | --- | ---: | --- | --- |\n${visuals.map((v,index)=>`| ${index + 1} | \`${v.name}\` | ${v.width} × ${v.height} | ${v.id.endsWith('-logo') ? 'SVG / transparent PNG' : v.id === 'site-icon' ? 'PNG' : 'JPG'} | ${v.page} |`).join('\n')}\n`;
await fs.writeFile(path.join(out,'illustrator-artboard-index.md'),artboardList);
const csv=['filename,width_px,height_px,ratio,fit,page,optional',...visuals.map(v=>[v.name,v.width,v.height,v.ratio,v.fit,v.page,!!v.optional].join(','))].join('\n');
await fs.writeFile(path.join(out,'visual-manifest.csv'),csv+'\n');
const groups=Map.groupBy ? Map.groupBy(visuals,v=>`${v.width} × ${v.height}`) : visuals.reduce((m,v)=>{const k=`${v.width} × ${v.height}`;m.set(k,[...(m.get(k)||[]),v]);return m;},new Map());
const checklist=`# XIONS GROUP 图片位置与交付清单

更新：2026-09-16。本节取代旧尺寸表；依据已实现的图片框。源数据：src/data/visuals.json。共 ${visuals.length} 项，Betenoir 预告可暂缓；同一 Logo 在首页与品牌总览复用，不需重复导出。

## 尺寸为什么这样定

- 页面位置先于导出尺寸：全宽背景使用 cover 随视口裁切；正文横图固定 3:2、详情竖图固定 4:5，避免任意增加比例。
- 桌面首屏 2560×1440（16:9）是宽屏母版；浏览器较高或较窄时仍会裁切。
- 手机首屏 CSS 使用 100svh，覆盖浏览器可用视口（不含浏览器工具栏）；1440×3120（6:13，即9:19.5）是长屏母版，不是所有手机的固定显示比例。短屏上下裁切、宽窄不同也会裁切。不要把图片尺寸当作页面高度。
- 横图最大显示宽约1248 CSS px，2400px 母版接近2倍；双栏竖图约600px宽，1600px母版留高清余量。浏览器实际下载将按需生成较小版本，不要求所有设备下载母版。
- Logo 1200×480是统一放置框，不改变字标原比例；优先SVG。分享封面与图标分别服务社交平台和浏览器，所以独立规格。

## 页面规划

| 页面 | 图片位置 | 手机布局 |
|---|---|---|
| 首页 | 一组桌面／手机全屏背景；四个品牌Logo；恢复六个活动标识 | 独立长屏背景；品牌Logo同源；活动标识两列 |
| Le groupe | 负责人内容后的三人合照，3:2 | 保持3:2，完整人物 |
| Nos marques | 四个品牌Logo，复用首页 | 完整显示，不裁切 |
| L’Entropiste | 标题下3:2系列；4:5获奖图与文字并列 | 图文上下排列 |
| Betenoir | 标题下3:2预告，可暂缓 | 保持3:2 |
| Sunlution | 3:2主视觉；两张4:5产品／质地 | 竖图上下排列 |
| Masqly | 3:2产品系列；两张4:5使用图 | 竖图上下排列 |
| Presse | 七类活动图库＋户外广告／媒体报道／数字社交三类图库，全部3:2 | 单列 |
| Engagements / Carrières / Contact / 法律 | 本阶段不增加装饰图片 | 保持简洁 |

## 按尺寸交付

${[...groups].map(([size,items])=>`### ${size} px · ${items[0].ratio.replaceAll(' / ',':')}\n\n${items.map(v=>`- [ ] **${v.name}${v.id.endsWith('-logo')?'.svg（或透明PNG）':v.id==='site-icon'?'.png':'.jpg'}**${v.optional?'（可选）':''}\n  - 用途：${v.use}\n  - 位置：${v.page}；${v.fit==='contain'?'完整显示，留白、不裁切':'填满图片框，允许裁切'}。`).join('\n')}\n`).join('\n')}
## 构图与交付规则

首页照片不要烘焙网页标题、按钮或规格文字；它们由网页叠加。桌面左侧约55%避免关键主体。手机主体尽量在中央，顶部15%及底部20%不放不可裁内容；这些是构图起点，须在390×844和短屏上复核，不能保证零裁切。正文产品、证书和报道使用完整显示，原图比例不同可加留白。母版不要强行放大小图。

保持上述英文小写文件名。照片交付 sRGB JPG 高质量，透明素材 PNG，Logo 优先 SVG；摄影无需300DPI，像素尺寸才决定网页清晰度。原图／编辑文件放 local-materials/visual-kit 或你的素材目录；审核后网站版本放 public/images 并在清单源数据填写 src、alt。网页格式和压缩由开发处理，母版不直接全部上传Git。

Presse按修正原文恢复十个图库入口，每类先准备一张代表图，后续可扩展。原来的 xionsgroup-press-event-01 通用活动图改用具体活动名称命名，避免无法判断归属。首页恢复现有六个活动SVG标识，暂不新增画板；现有标识为简化示意字标，上线前可用正式素材替换。轮播第2、3组和个人肖像暂不列入本轮。旧PDF尺寸表已废止。

## 制作模板

见同目录 visual-kit/README.md。已有 Illustrator 原生画板生成脚本，以及 Affinity 分组SVG模板；后者不是原生画板。生成脚本通过静态检查，但尚未在桌面设计软件中验证导入效果。

`;
const checklistPath=path.join(root,'local-materials/launch-content-and-visual-checklist.md');
let prior=await fs.readFile(checklistPath,'utf8').catch(error=>{if(error.code==='ENOENT')return '';throw error;});
if(!prior.includes('依据已实现的图片框')) await fs.writeFile(path.join(out,'previous-checklist-2026-09-15.md'),prior);
const start=prior.indexOf('## 以下为内容与上线核对记录');
const end=prior.indexOf('## 素材交付清单',start);
let audit=start>=0?prior.slice(start,end>=0?end:undefined):'';
audit=audit.replace(/3\. \*\*Press 真实性\*\*[^\n]*/, '3. **Press 真实性**：已按原文恢复七类活动和三类传播图库；每张实图还需品牌、日期、地点与参与方式，不添加原文未写的官方合作或获奖关系。')
 .replace(/4\. \*\*活动标识\*\*[^\n]*/, '4. **活动标识**：首页六个现有SVG已恢复；当前为简化示意字标，上线前替换批准的素材。活动露出与品牌实际获奖在文案上分开。')
 .replace(/5\. \*\*视觉落地\*\*[^\n]*/, '5. **视觉落地**：已实现首页、集团、品牌与Press的标注图片框，待按本清单填入真实素材；首页当前为单张，不启用空轮播。')
 .replace(/7\. \*\*移动端与无障碍\*\*[^\n]*/, '7. **移动端与无障碍**：最终素材入库后复核裁切、文字对比、导航键盘操作；若增加轮播，再实现暂停与减少动态效果偏好。');
await fs.writeFile(checklistPath,checklist+audit);
await fs.writeFile(path.join(out,'README.md'),`# 图片制作模板

## 推荐路径：Illustrator 原生画板 → 制作／批量导出

1. Illustrator：文件 → 脚本 → 其他脚本，选择 **create-xionsgroup-web-artboards.jsx**。
2. 脚本新建RGB文档，创建${visuals.length}个不重叠、已命名、尺寸正确的空画板；不会操作或覆盖现有文档。另存AI文件。
3. 把对应图片放入画板，按框裁切／留白。使用“导出为屏幕所用格式”，选择所有画板、1×、使用画板名称。照片JPG；Logo与图标透明PNG或SVG。
4. 脚本以1pt对应72ppi导出的1px建板；若手动改成300ppi输出，会导致像素尺寸放大。交付前对照 illustrator-artboard-index.md 或 visual-manifest.csv 核对实际像素。

## Affinity 优先的替代路径：分组模板 → 切片

1. 用“打开”载入 xionsgroup-named-groups.svg，不是拖到现有页面中。每个白色矩形是一个对应尺寸的分组；总画布很大，缩放至全部可看到。
2. SVG是标准命名分组，**不是Affinity原生画板**。名称能否原样保留和具体切片入口需要在你当前融合版中实测；不可承诺一键变成原生画板。若名称未保留，对照CSV重命名。
3. 在每组白框内放入／裁切图片。Logo组完成后去掉白底，使其透明。不要变更组边界；导出范围按原白框建立。
4. 在导出切片功能中为各组建立同名切片；首次需要设置，之后保存Affinity源文件即可复用并统一导出。设置1×，检查切片像素与CSV一致。若当前版本没有从分组创建切片，改用Illustrator脚本路径，或仅手动建立七种尺寸母板再复制命名。

Affinity Designer 官方旧版文档说明可从图层／分组建立切片并批量导出；融合版界面未验证，不能把旧版菜单名称视作保证。不要再用PDF导入作为原生画板方案。

模板内容为空白，不包含网页占位框上的文字。保留一份可编辑源文件，后续只替换组内图片再批量导出。交付清单：../launch-content-and-visual-checklist.md。

来源：
- https://s3-eu-west-1.amazonaws.com/affinity-docs/help/designer/en-US.lproj/pages/ExportPersona/exportPersona.html
- https://s3-eu-west-1.amazonaws.com/affinity-docs/help/designer_beta/en-US.lproj/pages/ExportPersona/exportPersona_layersPanel.html
`);
console.log(`Generated ${visuals.length} visual templates (${width} × ${height} canvas) in ${out}`);
