# 系统配置模块 (System Config)

## 功能概述

系统配置模块提供了灵活的配置管理功能，支持多种配置类型和分类，用于管理系统的全局参数。

## 配置分类

### 1. 基础设置 (basic)
- 网站名称、Logo、Favicon
- SEO设置（描述、关键词）
- 版权信息、ICP备案
- 联系方式

### 2. 功能开关 (feature)
- 用户注册开关
- 邮箱验证开关
- 问卷审核模式
- 模板市场开关
- AI助手开关
- 评论功能开关

### 3. 安全设置 (security)
- 密码复杂度要求
- 登录失败限制
- JWT过期时间
- 验证码开关
- IP黑白名单

### 4. 业务规则 (business)
- 用户最大问卷数
- 问卷最大题目数
- 问卷最大答卷数
- 文件上传限制
- 图片尺寸限制

### 5. 邮件配置 (email)
- SMTP服务器设置
- SMTP认证信息
- 发件人信息

### 6. 存储配置 (storage)
- 存储类型选择（本地/阿里云/七牛云/腾讯云）
- OSS配置
- CDN配置

## API 接口

### 初始化默认配置
```
POST /api/admin/system-config/initialize
权限：super_admin
```

### 获取所有配置
```
GET /api/admin/system-config
权限：super_admin, admin
返回：按分类分组的配置对象
```

### 获取公开配置
```
GET /api/admin/system-config/public
权限：无需认证
返回：前端可访问的配置键值对
```

### 获取分类配置
```
GET /api/admin/system-config/category/:category
权限：super_admin, admin
参数：category (basic|feature|security|business|email|storage)
```

### 获取单个配置
```
GET /api/admin/system-config/:key
权限：super_admin, admin
参数：key (配置键，如 site.name)
```

### 更新单个配置
```
PATCH /api/admin/system-config/:key
权限：super_admin, admin
Body: { key: string, value: any }
```

### 批量更新配置
```
PATCH /api/admin/system-config/batch
权限：super_admin, admin
Body: { configs: [{ key: string, value: any }] }
```

### 重置配置
```
POST /api/admin/system-config/:key/reset
权限：super_admin
```

## 使用方法

### 1. 初始化配置

首次使用时需要初始化默认配置：

```bash
cd server
npm run init:config
```

或者通过API调用：
```bash
POST /api/admin/system-config/initialize
```

### 2. 前端获取公开配置

前端可以无需认证获取公开配置：

```typescript
import { getPublicConfigsAPI } from '@/api/modules/system-config'

const configs = await getPublicConfigsAPI()
// 返回: { 'site.name': 'QuizzyFlow', 'feature.register': true, ... }
```

### 3. 管理员获取所有配置

```typescript
import { getAllConfigsAPI } from '@/api/modules/system-config'

const configs = await getAllConfigsAPI()
// 返回: {
//   basic: [...],
//   feature: [...],
//   security: [...],
//   ...
// }
```

### 4. 更新配置

单个更新：
```typescript
import { updateConfigAPI } from '@/api/modules/system-config'

await updateConfigAPI('site.name', 'My QuizzyFlow')
```

批量更新：
```typescript
import { batchUpdateConfigsAPI } from '@/api/modules/system-config'

await batchUpdateConfigsAPI({
  configs: [
    { key: 'site.name', value: 'My QuizzyFlow' },
    { key: 'feature.register', value: false },
  ]
})
```

## 数据结构

### SystemConfig Schema

```typescript
{
  key: string                    // 配置键（唯一）
  value: any                     // 配置值
  valueType: string              // 值类型
  name: string                   // 配置名称
  description: string            // 配置描述
  category: string               // 分类
  isPublic: boolean              // 是否公开
  isEncrypted: boolean           // 是否加密
  isActive: boolean              // 是否启用
  isSystem: boolean              // 是否系统配置
  validation: {                  // 验证规则
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  sortOrder: number              // 排序
  updatedBy: string              // 更新者
  createdAt: Date
  updatedAt: Date
}
```

## 安全特性

### 1. 加密存储
敏感配置（如密码、密钥）会被加密存储：
- SMTP密码
- OSS AccessKey
- 其他API密钥

### 2. 权限控制
- super_admin：所有操作权限
- admin：读取和更新权限（不能重置配置）
- 普通用户：只能访问公开配置

### 3. IP访问控制
可以配置IP黑白名单限制后台访问。

## 注意事项

1. **加密密钥**：生产环境请设置环境变量 `CONFIG_ENCRYPTION_KEY`
2. **配置缓存**：建议在应用启动时加载配置并缓存
3. **敏感配置**：不要将敏感配置设为公开 (isPublic=false)
4. **系统配置**：标记为系统配置的项不能被删除
5. **备份**：修改配置前建议先备份数据库

## 前端页面

系统设置页面位于：`/admin/settings`

包含以下Tab：
- 基础设置
- 功能开关
- 安全设置
- 业务规则
- 邮件配置
- 存储配置

## 开发指南

### 添加新配置

1. 在 Service 的 `initializeDefaultConfig()` 方法中添加默认配置
2. 在前端类型文件中添加类型定义
3. 在对应的配置组件中添加表单项

### 自定义验证

配置支持验证规则：
```typescript
validation: {
  min: 6,           // 最小值
  max: 20,          // 最大值
  pattern: '^\\d+$', // 正则表达式
  options: ['a', 'b', 'c'] // 枚举值
}
```

## 故障排查

### 配置未生效
1. 检查配置的 `isActive` 状态
2. 检查应用是否重新加载了配置
3. 检查缓存是否已更新

### 无法保存配置
1. 检查权限是否足够
2. 检查配置验证规则
3. 查看后端日志错误信息

### 加密配置无法读取
1. 检查 `CONFIG_ENCRYPTION_KEY` 环境变量
2. 确保加密密钥在不同环境间一致

