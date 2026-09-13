# GoDaddy DNS 配置指南（保留现有邮箱）

## 🎯 目标
让 xionsgroup.com 指向 Netlify，但保留 GoDaddy 的邮箱服务（MX 记录）。

---

## 📋 配置步骤

### 方式 1: 使用 www 子域名（推荐 ⭐）

这种方式最安全，不会影响邮箱：

1. **登录 GoDaddy**
   - 访问：https://dcc.godaddy.com/manage/dns
   - 找到 xionsgroup.com

2. **添加 CNAME 记录**
   ```
   类型：   CNAME
   名称：   www
   值：     xionsgroup.netlify.app
   TTL：    600（或默认）
   ```

3. **添加 URL 重定向（可选）**
   ```
   从：     xionsgroup.com
   到：     www.xionsgroup.com
   类型：   301 永久重定向
   转发路径：是
   ```

4. **在 Netlify 配置自定义域名**
   ```bash
   netlify domains:add www.xionsgroup.com
   ```

**结果**：
- ✅ www.xionsgroup.com → Netlify 网站
- ✅ xionsgroup.com → 自动跳转到 www
- ✅ contact@xionsgroup.com → 保持正常工作

---

### 方式 2: 使用 Apex 域名（需要额外配置）

如果你坚持使用 xionsgroup.com（不带 www）：

1. **在 GoDaddy 设置 A 记录**
   ```
   类型：   A
   名称：   @
   值：     75.2.60.5
   TTL：    600
   
   （Netlify 的负载均衡 IP）
   ```

2. **添加 AAAA 记录（IPv6）**
   ```
   类型：   AAAA
   名称：   @
   值：     2600:1f18:2148:bc00:3973:3975:0d6d:7a42
   TTL：    600
   ```

3. **保留所有 MX 记录**
   ```
   不要删除或修改任何 MX 记录！
   邮箱服务依赖这些记录。
   ```

4. **在 Netlify 配置**
   ```bash
   netlify domains:add xionsgroup.com
   ```

**注意**：
- ⚠️ 某些 GoDaddy 套餐不允许修改 @ 记录的 A 记录
- ⚠️ 如果修改失败，只能用方式 1

---

## 🔍 验证配置

### 检查 DNS 生效
```bash
# 检查 CNAME（方式1）
dig www.xionsgroup.com CNAME

# 检查 A 记录（方式2）
dig xionsgroup.com A

# 检查 MX 记录（确保邮箱不受影响）
dig xionsgroup.com MX
```

### 预期结果
```
方式 1:
www.xionsgroup.com → CNAME → xionsgroup.netlify.app

方式 2:
xionsgroup.com → A → 75.2.60.5

邮箱（两种方式都应该保留）:
xionsgroup.com → MX → mail.yourmailserver.com
```

---

## ⏱️ 生效时间

- **CNAME/A 记录**：10分钟 - 2小时
- **SSL 证书**：Netlify 自动生成（可能需要等 DNS 生效后）
- **邮箱服务**：不受影响，立即可用

---

## 🚨 重要提醒

### ✅ DO（要做的）
- ✅ 只添加 CNAME 或 A 记录
- ✅ 保留所有现有 MX 记录
- ✅ 保留所有现有 TXT 记录（SPF, DKIM 等）
- ✅ 记录原始 DNS 设置（以防需要回滚）

### ❌ DON'T（不要做的）
- ❌ 不要修改或删除 MX 记录
- ❌ 不要修改任何邮箱相关的记录
- ❌ 不要使用 Netlify 的 DNS 服务器
- ❌ 不要修改 Nameservers

---

## 📸 GoDaddy 操作截图参考

1. **找到 DNS 管理**
   ```
   My Products → Domains → xionsgroup.com → DNS
   ```

2. **添加记录**
   ```
   点击 "Add" 按钮
   选择 "CNAME"
   填写：
     Host: www
     Points to: xionsgroup.netlify.app
     TTL: 1 Hour
   保存
   ```

3. **现有记录示例**
   ```
   类型    名称    值                      操作
   ─────────────────────────────────────────────
   A       @       xxx.xxx.xxx.xxx        [不要动]
   MX      @       mail.xxx.com           [不要动] ⚠️
   TXT     @       v=spf1...              [不要动] ⚠️
   CNAME   www     xionsgroup.netlify.app [新增] ✅
   ```

---

## 🔧 Netlify 配置命令

在完成 GoDaddy 设置后，运行：

```bash
cd /Users/seajelly/Documents/Xionsgroup/web/site

# 方式 1: 使用 www
netlify domains:add www.xionsgroup.com

# 方式 2: 使用 apex（如果 GoDaddy 允许）
netlify domains:add xionsgroup.com

# 查看域名状态
netlify domains:list

# 启用 HTTPS（自动）
# Netlify 会自动配置 Let's Encrypt SSL 证书
```

---

## ✅ 配置完成检查清单

- [ ] GoDaddy 添加了 CNAME 或 A 记录
- [ ] MX 记录保持不变
- [ ] Netlify 添加了自定义域名
- [ ] DNS 已生效（dig 命令验证）
- [ ] HTTPS 证书已生成（绿锁）
- [ ] 网站可以正常访问
- [ ] 邮箱可以正常收发 ✅

---

## 🆘 如果出现问题

### 问题 1: "DNS_PROBE_FINISHED_NXDOMAIN"
**原因**：DNS 还未生效
**解决**：等待 10-60 分钟，清除浏览器缓存

### 问题 2: "Your connection is not private"
**原因**：SSL 证书还在生成中
**解决**：等待 10-30 分钟，Netlify 会自动配置

### 问题 3: 邮箱不能收发了
**原因**：不小心删除了 MX 记录
**解决**：
1. 立即在 GoDaddy 恢复 MX 记录
2. 联系 GoDaddy 支持

### 问题 4: GoDaddy 不允许修改 @ 记录
**原因**：某些套餐限制
**解决**：使用方式 1（www 子域名）

---

## 💡 推荐方案

**我强烈推荐方式 1（www 子域名）**：

优点：
✅ 100% 不会影响邮箱
✅ 配置简单，不会出错
✅ 符合最佳实践（大部分网站都用 www）
✅ GoDaddy 通常不限制 CNAME 记录

缺点：
❌ URL 里有 www（但可以自动跳转）

---

## 📞 需要帮助？

如果配置过程中遇到问题：
1. 截图 GoDaddy DNS 管理页面
2. 告诉我具体错误信息
3. 我会帮你逐步排查

---

**准备好配置了吗？你想用哪种方式？**
- 方式 1: www.xionsgroup.com（推荐）
- 方式 2: xionsgroup.com（需要你确认 GoDaddy 允许修改）
