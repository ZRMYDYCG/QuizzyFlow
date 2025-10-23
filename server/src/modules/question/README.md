# Question Module API Documentation

## 概述

问卷管理模块，提供完整的 CRUD 操作，支持软删除、星标、复制等功能。完全遵循 RESTful API 设计规范。

## 数据模型

### Question Schema

```typescript
{
  _id: ObjectId,              // MongoDB 自动生成
  title: string,              // 问卷标题（必填）
  desc: string,               // 问卷描述
  js: string,                 // 自定义 JavaScript
  css: string,                // 自定义 CSS
  isPublished: boolean,       // 是否已发布（默认 false）
  isStar: boolean,            // 是否星标（默认 false）
  isDeleted: boolean,         // 是否删除（默认 false，软删除）
  author: string,             // 作者用户名（必填）
  componentList: ComponentItem[], // 组件列表
  selectedId: string | null,  // 当前选中的组件ID
  copiedComponent: object | null, // 复制的组件
  createdAt: Date,            // 创建时间（自动）
  updatedAt: Date             // 更新时间（自动）
}
```

### ComponentItem

```typescript
{
  fe_id: string,              // 前端生成的唯一ID（使用 nanoid）
  type: string,               // 组件类型（如 'question-input', 'question-radio' 等）
  title: string,              // 组件标题
  isHidden: boolean,          // 是否隐藏（默认 false）
  isLocked: boolean,          // 是否锁定（默认 false）
  props: object               // 组件属性（根据不同组件类型而定）
}
```

## API 端点

### 1. 创建问卷

**请求**
```http
POST /api/question
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "我的问卷",  // 可选，默认自动生成
  "desc": "问卷描述",   // 可选
  "componentList": []   // 可选，默认创建基础组件
}
```

**响应**
```json
{
  "errno": 0,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "我的问卷",
    "desc": "问卷描述",
    "author": "username",
    "componentList": [
      {
        "fe_id": "abc123",
        "type": "question-info",
        "title": "问卷信息",
        "isHidden": false,
        "isLocked": false,
        "props": {
          "title": "问卷标题",
          "desc": "问卷描述..."
        }
      }
    ],
    "isPublished": false,
    "isStar": false,
    "isDeleted": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. 获取问卷列表

**请求**
```http
GET /api/question?keyword=xxx&page=1&pageSize=10&isStar=true&isDeleted=false
Authorization: Bearer <token>
```

**查询参数**
- `keyword` (string, 可选): 搜索关键词（搜索标题和描述）
- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 10
- `isStar` (boolean, 可选): 是否只显示星标问卷
- `isDeleted` (boolean, 可选): 是否只显示已删除问卷，默认 false

**响应**
```json
{
  "errno": 0,
  "data": {
    "list": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "问卷标题",
        "desc": "问卷描述",
        "author": "username",
        "componentList": [...],
        "isPublished": false,
        "isStar": true,
        "isDeleted": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 3. 获取单个问卷

**请求**
```http
GET /api/question/:id
Authorization: Bearer <token>
```

**响应**
```json
{
  "errno": 0,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "问卷标题",
    "desc": "问卷描述",
    "author": "username",
    "componentList": [...],
    "isPublished": false,
    "isStar": false,
    "isDeleted": false,
    "js": "// 自定义 JS",
    "css": "/* 自定义 CSS */",
    "selectedId": null,
    "copiedComponent": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**错误响应**
- `400`: 无效的问卷ID
- `403`: 无权访问此问卷
- `404`: 问卷不存在

---

### 4. 更新问卷

**请求**
```http
PATCH /api/question/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新标题",
  "desc": "新描述",
  "componentList": [...],
  "isStar": true,
  "isPublished": true
}
```

**说明**
- 所有字段都是可选的
- 只更新提供的字段
- 只能更新自己创建的问卷

**响应**
```json
{
  "errno": 0,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "新标题",
    "desc": "新描述",
    // ... 其他字段
  }
}
```

**错误响应**
- `400`: 无效的问卷ID
- `403`: 无权修改此问卷
- `404`: 问卷不存在

---

### 5. 批量删除（软删除）

**请求**
```http
DELETE /api/question
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**说明**
- 这是软删除，将 `isDeleted` 设为 `true`
- 只能删除自己创建的问卷
- 至少需要提供一个ID

**响应**
```json
{
  "errno": 0,
  "data": {
    "deletedCount": 2,
    "message": "成功删除 2 个问卷"
  }
}
```

---

### 6. 复制问卷

**请求**
```http
POST /api/question/duplicate/:id
Authorization: Bearer <token>
```

**说明**
- 创建问卷的副本
- 标题自动添加 "_副本" 后缀
- 所有组件的 `fe_id` 会重新生成
- 复制的问卷默认未发布、未星标、未删除

**响应**
```json
{
  "errno": 0,
  "data": {
    "_id": "507f1f77bcf86cd799439099",
    "title": "原标题_副本",
    "desc": "原描述",
    "componentList": [
      // 组件列表（fe_id 已重新生成）
    ],
    "isPublished": false,
    "isStar": false,
    "isDeleted": false,
    // ... 其他字段
  }
}
```

**错误响应**
- `400`: 无效的问卷ID
- `403`: 无权复制此问卷
- `404`: 问卷不存在

---

### 7. 从回收站恢复

**请求**
```http
PATCH /api/question/:id/restore
Authorization: Bearer <token>
```

**说明**
- 将 `isDeleted` 设为 `false`
- 只能恢复自己的问卷
- 问卷必须在回收站中（isDeleted: true）

**响应**
```json
{
  "errno": 0,
  "data": {
    "message": "问卷已恢复",
    "data": {
      "_id": "507f1f77bcf86cd799439011",
      // ... 问卷详情
    }
  }
}
```

**错误响应**
- `400`: 无效的问卷ID 或 问卷未在回收站中
- `403`: 无权恢复此问卷
- `404`: 问卷不存在

---

### 8. 永久删除

**请求**
```http
DELETE /api/question/:id/permanent
Authorization: Bearer <token>
```

**说明**
- 从数据库中永久删除问卷
- 此操作不可恢复
- 只能删除自己的问卷

**响应**
```json
{
  "errno": 0,
  "data": {
    "message": "问卷已永久删除"
  }
}
```

**错误响应**
- `400`: 无效的问卷ID
- `403`: 无权删除此问卷
- `404`: 问卷不存在

---

### 9. 获取统计信息

**请求**
```http
GET /api/question/statistics
Authorization: Bearer <token>
```

**响应**
```json
{
  "errno": 0,
  "data": {
    "total": 100,      // 总问卷数
    "published": 30,   // 已发布数
    "starred": 15,     // 星标数（不含已删除）
    "deleted": 10,     // 已删除数
    "normal": 90       // 正常问卷数（未删除）
  }
}
```

---

## 权限控制

所有 API 都需要 JWT 认证，通过 `Authorization: Bearer <token>` 传递。

### 权限规则

1. **创建**: 任何登录用户都可以创建问卷
2. **读取**: 
   - 只能查看自己的问卷
   - 已发布的问卷可以被所有人查看
3. **更新**: 只能更新自己的问卷
4. **删除**: 只能删除自己的问卷
5. **复制**: 只能复制自己的问卷

## 索引优化

为提高查询性能，已添加以下索引：

```javascript
// 复合索引：作者 + 删除状态 + 星标状态
{ author: 1, isDeleted: 1, isStar: 1 }

// 复合索引：作者 + 创建时间（倒序）
{ author: 1, createdAt: -1 }

// 文本索引：标题搜索
{ title: 'text' }
```

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（未登录或 token 无效） |
| 403 | 禁止访问（无权限） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 使用示例

### 场景 1: 创建并编辑问卷

```javascript
// 1. 创建问卷
const createRes = await fetch('/api/question', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
const { data: question } = await createRes.json()

// 2. 更新问卷
await fetch(`/api/question/${question._id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '更新后的标题',
    componentList: [
      {
        fe_id: 'abc123',
        type: 'question-input',
        title: '输入框',
        isHidden: false,
        isLocked: false,
        props: {
          title: '请输入你的姓名',
          placeholder: '请输入...'
        }
      }
    ]
  })
})
```

### 场景 2: 问卷列表管理

```javascript
// 获取我的问卷列表
const listRes = await fetch('/api/question?page=1&pageSize=10', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const { data } = await listRes.json()
console.log(`共 ${data.total} 个问卷`)

// 获取星标问卷
const starRes = await fetch('/api/question?isStar=true', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// 获取回收站
const trashRes = await fetch('/api/question?isDeleted=true', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 场景 3: 回收站操作

```javascript
// 软删除
await fetch('/api/question', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ids: ['id1', 'id2']
  })
})

// 恢复
await fetch(`/api/question/${id}/restore`, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` }
})

// 永久删除
await fetch(`/api/question/${id}/permanent`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## 注意事项

1. **软删除**: 默认的删除操作是软删除，问卷仍保留在数据库中
2. **ID 验证**: 所有 ID 都会进行 MongoDB ObjectId 格式验证
3. **权限检查**: 所有操作都会验证用户权限
4. **性能优化**: 使用了 `.lean()` 优化只读查询性能
5. **并发查询**: 列表查询时，数据和计数并发执行
6. **唯一 ID**: 组件的 `fe_id` 使用 `nanoid` 生成，确保唯一性

## 前后端字段映射

| 前端字段 | 后端字段 | 说明 |
|---------|---------|------|
| title | title | 问卷标题 |
| desc | desc | 问卷描述 |
| isStar | isStar | 是否星标 |
| isDeleted | isDeleted | 是否删除 |
| componentList | componentList | 组件列表 |
| - | author | 后端自动设置 |
| - | createdAt | 后端自动生成 |
| - | updatedAt | 后端自动更新 |

