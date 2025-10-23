# QuizzyFlow 服务端开发指南

## 文档版本

- 版本：v1.0.0
- 适用范围：QuizzyFlow 后端服务

## 一、项目概述

### 1.1 技术栈

QuizzyFlow 服务端基于以下技术构建：

- **框架**: NestJS 10.x
- **数据库**: MongoDB 6.x+
- **ODM**: Mongoose 8.x
- **认证**: JWT (JSON Web Token)
- **语言**: TypeScript 5.x
- **包管理**: pnpm

### 1.2 项目结构

```
server/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── app.controller.ts       # 根控制器
│   ├── app.service.ts          # 根服务
│   │
│   ├── auth/                   # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.constants.ts
│   │   └── decorators/
│   │       └── public.decorator.ts
│   │
│   ├── user/                   # 用户模块
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   └── schemas/
│   │       └── user.schemas.ts
│   │
│   ├── question/               # 问卷模块
│   │   ├── question.controller.ts
│   │   ├── question.service.ts
│   │   ├── question.module.ts
│   │   ├── dto/
│   │   │   └── question.dto.ts
│   │   └── schemas/
│   │       └── question.schema.ts
│   │
│   ├── answer/                 # 答卷模块
│   │   ├── answer.controller.ts
│   │   ├── answer.service.ts
│   │   ├── answer.module.ts
│   │   └── schemas/
│   │       └── answer.schema.ts
│   │
│   ├── stat/                   # 统计模块
│   │   ├── stat.controller.ts
│   │   ├── stat.service.ts
│   │   └── stat.module.ts
│   │
│   ├── http-exeption/          # 全局异常过滤器
│   │   └── http-exception.filter.ts
│   │
│   └── transform/              # 全局响应转换拦截器
│       └── transform.interceptor.ts
│
├── test/                       # E2E 测试
├── nest-cli.json              # NestJS CLI 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖
```

### 1.3 核心功能模块

1. **用户认证模块 (Auth)**: JWT 认证、登录、注册
2. **用户管理模块 (User)**: 用户信息管理
3. **问卷管理模块 (Question)**: 问卷 CRUD、发布、星标、软删除
4. **答卷模块 (Answer)**: 用户提交的答卷数据
5. **统计模块 (Stat)**: 问卷统计分析

---

## 二、数据库设计

### 2.1 User 集合 (用户表)

用户基础信息表，用于认证和用户管理。

**集合名称**: `users`

**Schema 定义**:

```typescript
{
  _id: ObjectId,              // MongoDB 自动生成
  username: string,           // 用户名，唯一索引，必填
  password: string,           // 密码（加密存储），必填
  nickname: string,           // 用户昵称，可选
  email: string,              // 邮箱地址，唯一索引，可选
  avatar: string,             // 头像 URL，可选
  role: string,               // 用户角色: 'user' | 'admin'，默认 'user'
  status: string,             // 账号状态: 'active' | 'inactive' | 'banned'，默认 'active'
  createdAt: Date,            // 创建时间，自动生成
  updatedAt: Date             // 更新时间，自动生成
}
```

**索引**:
- `username`: 唯一索引
- `email`: 唯一索引（如果存在）

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| username | String | 是 | - | 登录用户名，3-20字符 |
| password | String | 是 | - | 加密后的密码 |
| nickname | String | 否 | - | 显示名称 |
| email | String | 否 | - | 邮箱地址 |
| avatar | String | 否 | - | 头像URL |
| role | String | 否 | 'user' | 用户角色 |
| status | String | 否 | 'active' | 账号状态 |

**安全注意事项**:
- 密码必须使用 bcrypt 进行加密存储，不得明文存储
- 返回给客户端的用户信息必须排除 password 字段
- username 和 email 需要验证格式合法性

---

### 2.2 Question 集合 (问卷表)

问卷主表，存储问卷的元数据和组件列表。

**集合名称**: `questions`

**Schema 定义**:

```typescript
{
  _id: ObjectId,              // MongoDB 自动生成
  title: string,              // 问卷标题，必填
  desc: string,               // 问卷描述，可选
  author: string,             // 作者用户名，必填（关联 User.username）
  
  // 问卷组件列表
  componentList: [
    {
      fe_id: string,          // 前端组件唯一ID（nanoid生成）
      type: string,           // 组件类型，如 'question-input', 'question-radio'
      title: string,          // 组件标题/描述
      isHidden: boolean,      // 是否隐藏
      isLocked: boolean,      // 是否锁定（不可编辑）
      props: object           // 组件属性（动态，根据type不同而不同）
    }
  ],
  
  // 自定义样式
  js: string,                 // 自定义 JavaScript 代码
  css: string,                // 自定义 CSS 样式
  
  // 状态标记
  isPublished: boolean,       // 是否已发布，默认 false
  isStar: boolean,            // 是否星标，默认 false
  isDeleted: boolean,         // 是否删除（软删除），默认 false
  
  // 统计数据
  answerCount: number,        // 答卷数量，默认 0
  viewCount: number,          // 浏览次数，默认 0
  
  // 时间戳
  createdAt: Date,            // 创建时间，自动生成
  updatedAt: Date,            // 更新时间，自动生成
  publishedAt: Date           // 发布时间，可选
}
```

**索引**:
- `author`: 普通索引（按作者查询）
- `isPublished`: 普通索引（查询已发布问卷）
- `isDeleted`: 普通索引（过滤删除的问卷）
- `isStar`: 普通索引（查询星标问卷）
- `createdAt`: 降序索引（按时间排序）

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| title | String | 是 | - | 问卷标题 |
| desc | String | 否 | '' | 问卷描述 |
| author | String | 是 | - | 创建者用户名 |
| componentList | Array | 否 | [] | 问卷组件数组 |
| js | String | 否 | '' | 自定义JS |
| css | String | 否 | '' | 自定义CSS |
| isPublished | Boolean | 否 | false | 发布状态 |
| isStar | Boolean | 否 | false | 星标状态 |
| isDeleted | Boolean | 否 | false | 删除状态 |
| answerCount | Number | 否 | 0 | 答卷数 |
| viewCount | Number | 否 | 0 | 浏览数 |

**componentList 组件类型**:

根据客户端设计，支持以下60+种组件类型：

**基础输入类**:
- `question-input`: 单行输入框
- `question-textarea`: 多行输入框
- `question-radio`: 单选题
- `question-checkbox`: 多选题
- `question-select`: 下拉选择
- `question-date`: 日期选择
- `question-slider`: 滑块
- `question-rate`: 评分

**高级选择类**:
- `question-cascader`: 级联选择
- `question-autocomplete`: 自动完成
- `question-transfer`: 穿梭框
- `question-upload`: 文件上传

**展示类**:
- `question-title`: 标题
- `question-paragraph`: 段落文本
- `question-image`: 图片
- `question-video`: 视频
- `question-audio`: 音频
- `question-qrcode`: 二维码

**交互类**:
- `question-button`: 按钮
- `question-link`: 链接
- `question-modal`: 对话框
- `question-drawer`: 抽屉
- `question-popover`: 气泡卡片
- `question-tooltip`: 文字提示

**布局类**:
- `question-tabs`: 标签页
- `question-collapse`: 折叠面板
- `question-steps`: 步骤条
- `question-timeline`: 时间轴
- `question-divider`: 分割线

**数据展示类**:
- `question-table`: 表格
- `question-list`: 列表
- `questionDescriptions`: 描述列表
- `questionTree`: 树形结构
- `questionCardGrid`: 卡片网格

**反馈类**:
- `question-alert`: 提示卡片
- `question-progress`: 进度条
- `question-spin`: 加载中
- `questionResult`: 结果页
- `questionSkeleton`: 骨架屏
- `questionEmpty`: 空状态

**其他**:
- `question-menu`: 菜单
- `question-dropdown`: 下拉菜单
- `question-anchor`: 锚点
- `question-badge`: 徽章标签
- `question-code`: 代码块
- `question-quote`: 引用块
- `question-highlight`: 高亮文本
- `question-marquee`: 滚动通知
- `question-timer`: 计时器
- `questionStatistic`: 统计数字
- `questionStatCard`: 统计卡片
- 等等...

**componentList.props 示例**:

不同类型组件的 props 结构不同，以下是常见示例：

```typescript
// question-input 示例
{
  fe_id: "c2",
  type: "question-input",
  title: "输入框",
  isHidden: false,
  isLocked: false,
  props: {
    title: "你的姓名",
    placeholder: "请输入你的姓名..."
  }
}

// question-radio 示例
{
  fe_id: "c7",
  type: "question-radio",
  title: "性别",
  isHidden: false,
  isLocked: false,
  props: {
    title: "单选标题",
    isVertical: false,
    options: [
      { text: "男", value: "male" },
      { text: "女", value: "female" },
      { text: "保密", value: "secret" }
    ],
    value: ""
  }
}

// question-checkbox 示例
{
  fe_id: "c8",
  type: "question-checkbox",
  title: "兴趣爱好",
  isHidden: false,
  isLocked: false,
  props: {
    title: "多选标题",
    isVertical: false,
    list: [
      { text: "篮球", value: "basketball", checked: false },
      { text: "足球", value: "football", checked: false }
    ]
  }
}
```

---

### 2.3 Answer 集合 (答卷表)

用户提交的答卷数据。

**集合名称**: `answers`

**Schema 定义**:

```typescript
{
  _id: ObjectId,              // MongoDB 自动生成
  questionId: string,         // 关联的问卷ID（Question._id）
  
  // 答案列表
  answerList: [
    {
      componentFeId: string,  // 对应问卷组件的 fe_id
      value: [string]         // 答案值数组（支持多值）
    }
  ],
  
  // 提交信息
  submitter: string,          // 提交者信息（可以是用户名或匿名标识）
  ipAddress: string,          // 提交者IP地址
  userAgent: string,          // 浏览器UA
  
  // 时间信息
  startTime: Date,            // 开始答题时间
  submitTime: Date,           // 提交时间
  duration: number,           // 答题耗时（秒）
  
  createdAt: Date,            // 创建时间，自动生成
  updatedAt: Date             // 更新时间，自动生成
}
```

**索引**:
- `questionId`: 普通索引（按问卷查询）
- `submitter`: 普通索引（按提交者查询）
- `submitTime`: 降序索引（按提交时间排序）

**字段说明**:

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| questionId | String | 是 | - | 关联问卷ID |
| answerList | Array | 是 | [] | 答案列表 |
| submitter | String | 否 | 'anonymous' | 提交者 |
| ipAddress | String | 否 | - | IP地址 |
| userAgent | String | 否 | - | 浏览器UA |
| startTime | Date | 否 | - | 开始时间 |
| submitTime | Date | 否 | - | 提交时间 |
| duration | Number | 否 | 0 | 耗时（秒） |

**answerList 数据示例**:

```typescript
{
  questionId: "65a1b2c3d4e5f6g7h8i9j0",
  answerList: [
    {
      componentFeId: "c2",
      value: ["张三"]           // 输入框答案
    },
    {
      componentFeId: "c7",
      value: ["male"]           // 单选答案
    },
    {
      componentFeId: "c8",
      value: ["basketball", "football"]  // 多选答案
    }
  ],
  submitter: "user123",
  ipAddress: "192.168.1.100",
  submitTime: "2025-01-19T10:30:00Z",
  duration: 120
}
```

---

## 三、API 接口设计

### 3.1 统一响应格式

所有 API 响应遵循统一格式（由 TransformInterceptor 实现）：

**成功响应**:
```typescript
{
  code: 0,
  data: any,          // 实际数据
  message: "Success"
}
```

**错误响应**:
```typescript
{
  code: number,       // HTTP 状态码
  message: string,    // 错误信息
  timestamp: string   // ISO 8601 时间戳
}
```

### 3.2 认证接口 (Auth)

#### 3.2.1 用户注册

```
POST /api/user/register
```

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```typescript
{
  username: string,   // 必填，3-20字符
  password: string,   // 必填，6-20字符
  nickname?: string   // 可选
}
```

**响应**:
```typescript
{
  code: 0,
  data: {
    _id: string,
    username: string,
    nickname: string,
    createdAt: string
  },
  message: "Success"
}
```

**错误码**:
- 400: 参数验证失败
- 409: 用户名已存在

---

#### 3.2.2 用户登录

```
POST /api/user/login
```

**请求体**:
```typescript
{
  username: string,   // 必填
  password: string    // 必填
}
```

**响应**:
```typescript
{
  code: 0,
  data: {
    token: string,    // JWT token
    username: string,
    nickname: string
  },
  message: "Success"
}
```

**错误码**:
- 400: 参数验证失败
- 401: 用户名或密码错误

**JWT Token 说明**:
- 有效期: 7天
- Payload 包含: `{ sub: userId, username: string }`
- 使用方式: `Authorization: Bearer <token>`

---

#### 3.2.3 获取当前用户信息

```
GET /api/user/info
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```typescript
{
  code: 0,
  data: {
    _id: string,
    username: string,
    nickname: string,
    email: string,
    avatar: string,
    role: string,
    createdAt: string
  },
  message: "Success"
}
```

**错误码**:
- 401: 未授权（token 无效或过期）

---

### 3.3 问卷接口 (Question)

#### 3.3.1 创建问卷

```
POST /api/question
```

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```typescript
{
  title: string,            // 必填
  desc?: string,
  componentList?: Array,    // 组件列表
  js?: string,
  css?: string
}
```

**响应**:
```typescript
{
  code: 0,
  data: {
    _id: string,
    title: string,
    desc: string,
    author: string,
    componentList: [],
    isPublished: false,
    isStar: false,
    isDeleted: false,
    answerCount: 0,
    viewCount: 0,
    createdAt: string,
    updatedAt: string
  },
  message: "Success"
}
```

---

#### 3.3.2 获取问卷列表

```
GET /api/question?page=1&pageSize=10&keyword=&isStar=false&isDeleted=false
```

**请求头**:
```
Authorization: Bearer <token>
```

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | Number | 否 | 1 | 页码 |
| pageSize | Number | 否 | 10 | 每页数量 |
| keyword | String | 否 | '' | 搜索关键词（标题） |
| isStar | Boolean | 否 | - | 是否星标 |
| isDeleted | Boolean | 否 | false | 是否删除 |

**响应**:
```typescript
{
  code: 0,
  data: {
    list: [
      {
        _id: string,
        title: string,
        desc: string,
        isPublished: boolean,
        isStar: boolean,
        isDeleted: boolean,
        answerCount: number,
        viewCount: number,
        createdAt: string,
        updatedAt: string
      }
    ],
    total: number,
    page: number,
    pageSize: number
  },
  message: "Success"
}
```

**说明**:
- 只返回当前用户创建的问卷
- 默认按创建时间倒序排序
- 支持按标题模糊搜索

---

#### 3.3.3 获取单个问卷

```
GET /api/question/:id
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: {
    _id: string,
    title: string,
    desc: string,
    author: string,
    componentList: [
      {
        fe_id: string,
        type: string,
        title: string,
        isHidden: boolean,
        isLocked: boolean,
        props: object
      }
    ],
    js: string,
    css: string,
    isPublished: boolean,
    isStar: boolean,
    isDeleted: boolean,
    answerCount: number,
    viewCount: number,
    createdAt: string,
    updatedAt: string
  },
  message: "Success"
}
```

**错误码**:
- 404: 问卷不存在
- 403: 无权访问（不是作者）

---

#### 3.3.4 更新问卷

```
PATCH /api/question/:id
```

**请求头**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**路径参数**:
- `id`: 问卷ID

**请求体**:
```typescript
{
  title?: string,
  desc?: string,
  componentList?: Array,
  js?: string,
  css?: string,
  isPublished?: boolean,
  isStar?: boolean
}
```

**响应**:
```typescript
{
  code: 0,
  data: {
    // 更新后的完整问卷数据
  },
  message: "Success"
}
```

**错误码**:
- 404: 问卷不存在
- 403: 无权修改（不是作者）

---

#### 3.3.5 删除问卷（软删除）

```
DELETE /api/question/:id
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: null,
  message: "Success"
}
```

**说明**:
- 执行软删除，将 `isDeleted` 设置为 `true`
- 软删除的问卷可以从回收站恢复

---

#### 3.3.6 彻底删除问卷

```
DELETE /api/question/:id/permanent
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: null,
  message: "Success"
}
```

**说明**:
- 物理删除，不可恢复
- 同时删除关联的所有答卷数据

---

#### 3.3.7 恢复问卷

```
PATCH /api/question/:id/restore
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: {
    // 恢复后的问卷数据
  },
  message: "Success"
}
```

---

#### 3.3.8 复制问卷

```
POST /api/question/:id/duplicate
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `id`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: {
    // 新创建的问卷数据（标题加上 "副本" 后缀）
  },
  message: "Success"
}
```

---

### 3.4 答卷接口 (Answer)

#### 3.4.1 提交答卷

```
POST /api/answer
```

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```typescript
{
  questionId: string,     // 必填
  answerList: [
    {
      componentFeId: string,
      value: string[]
    }
  ],
  startTime?: string,     // ISO 8601 格式
  duration?: number       // 答题耗时（秒）
}
```

**响应**:
```typescript
{
  code: 0,
  data: {
    _id: string,
    questionId: string,
    answerList: [],
    submitter: string,
    submitTime: string,
    createdAt: string
  },
  message: "Success"
}
```

**说明**:
- 该接口为公开接口，无需认证
- 自动记录 IP 地址和 User-Agent
- 提交后自动更新问卷的 answerCount

---

#### 3.4.2 获取问卷答卷列表

```
GET /api/answer?questionId=xxx&page=1&pageSize=20
```

**请求头**:
```
Authorization: Bearer <token>
```

**查询参数**:

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| questionId | String | 是 | - | 问卷ID |
| page | Number | 否 | 1 | 页码 |
| pageSize | Number | 否 | 20 | 每页数量 |

**响应**:
```typescript
{
  code: 0,
  data: {
    list: [
      {
        _id: string,
        questionId: string,
        answerList: [],
        submitter: string,
        ipAddress: string,
        submitTime: string,
        duration: number,
        createdAt: string
      }
    ],
    total: number,
    page: number,
    pageSize: number
  },
  message: "Success"
}
```

**权限**:
- 只有问卷作者可以查看答卷

---

### 3.5 统计接口 (Stat)

#### 3.5.1 获取问卷统计数据

```
GET /api/stat/:questionId
```

**请求头**:
```
Authorization: Bearer <token>
```

**路径参数**:
- `questionId`: 问卷ID

**响应**:
```typescript
{
  code: 0,
  data: {
    questionId: string,
    answerCount: number,      // 总答卷数
    viewCount: number,        // 浏览次数
    
    // 组件统计（每个组件的答案分布）
    componentStats: [
      {
        componentFeId: string,
        componentTitle: string,
        componentType: string,
        
        // 选择题统计
        options?: [
          {
            value: string,
            text: string,
            count: number,
            percentage: number
          }
        ],
        
        // 输入题答案列表
        answers?: string[]
      }
    ],
    
    // 时间分布
    timeDistribution: {
      byDay: [
        {
          date: string,
          count: number
        }
      ],
      byHour: [
        {
          hour: number,
          count: number
        }
      ]
    },
    
    // 平均答题时长
    avgDuration: number
  },
  message: "Success"
}
```

**权限**:
- 只有问卷作者可以查看统计

---

## 四、开发规范

### 4.1 模块开发流程

创建新模块时，遵循以下步骤：

1. **创建模块目录**
   ```bash
   cd server/src
   nest g module feature
   nest g controller feature
   nest g service feature
   ```

2. **定义 Schema**
   - 在 `schemas/` 目录创建 Mongoose Schema
   - 使用 `@Schema()` 装饰器
   - 添加 `timestamps: true` 自动生成时间戳
   - 导出 Schema 和 Document 类型

3. **定义 DTO**
   - 在 `dto/` 目录创建 DTO 类
   - 使用 `class-validator` 装饰器进行验证
   - 区分 CreateDto 和 UpdateDto

4. **实现 Service**
   - 注入 Model
   - 实现业务逻辑
   - 处理异常情况
   - 使用 `.exec()` 执行查询

5. **实现 Controller**
   - 定义路由
   - 参数验证
   - 调用 Service
   - 添加认证守卫

6. **注册模块**
   - 在 Module 中注册
   - 导出需要被其他模块使用的 Service

### 4.2 代码规范

#### 4.2.1 命名规范

- **文件名**: kebab-case（如 `user-profile.service.ts`）
- **类名**: PascalCase（如 `UserProfileService`）
- **方法名**: camelCase（如 `getUserProfile`）
- **常量**: UPPER_SNAKE_CASE（如 `JWT_SECRET`）
- **接口**: PascalCase，以 `I` 开头（如 `IUser`）

#### 4.2.2 Controller 规范

```typescript
@Controller('api/feature')
@UseGuards(AuthGuard)
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.featureService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.featureService.findOne(id)
  }

  @Post()
  async create(@Body() createDto: CreateFeatureDto) {
    return this.featureService.create(createDto)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeatureDto
  ) {
    return this.featureService.update(id, updateDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.featureService.remove(id)
  }
}
```

#### 4.2.3 Service 规范

```typescript
@Injectable()
export class FeatureService {
  constructor(
    @InjectModel(Feature.name)
    private featureModel: Model<Feature>
  ) {}

  async findAll(query: QueryDto): Promise<PaginatedResult<Feature>> {
    const { page = 1, pageSize = 10, keyword } = query
    
    const filter: any = {}
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' }
    }
    
    const [list, total] = await Promise.all([
      this.featureModel
        .find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .exec(),
      this.featureModel.countDocuments(filter).exec()
    ])
    
    return {
      list,
      total,
      page,
      pageSize
    }
  }

  async findOne(id: string): Promise<Feature> {
    const feature = await this.featureModel.findById(id).exec()
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`)
    }
    return feature
  }

  async create(createDto: CreateFeatureDto): Promise<Feature> {
    const created = new this.featureModel(createDto)
    return created.save()
  }

  async update(id: string, updateDto: UpdateFeatureDto): Promise<Feature> {
    const updated = await this.featureModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec()
    
    if (!updated) {
      throw new NotFoundException(`Feature with ID ${id} not found`)
    }
    
    return updated
  }

  async remove(id: string): Promise<void> {
    const result = await this.featureModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Feature with ID ${id} not found`)
    }
  }
}
```

#### 4.2.4 异常处理规范

使用 NestJS 内置异常类：

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  ConflictException
} from '@nestjs/common'

// 参数验证失败
throw new BadRequestException('Invalid parameters')

// 认证失败
throw new UnauthorizedException('Invalid credentials')

// 资源不存在
throw new NotFoundException('Resource not found')

// 权限不足
throw new ForbiddenException('Access denied')

// 资源冲突
throw new ConflictException('Username already exists')
```

### 4.3 安全规范

#### 4.3.1 密码安全

```typescript
import * as bcrypt from 'bcrypt'

// 加密密码
const saltRounds = 10
const hashedPassword = await bcrypt.hash(password, saltRounds)

// 验证密码
const isMatch = await bcrypt.compare(password, hashedPassword)
```

#### 4.3.2 JWT 认证

```typescript
// 生成 Token
const payload = { sub: user._id, username: user.username }
const token = await this.jwtService.signAsync(payload)

// 验证 Token（由 AuthGuard 自动处理）
// 在 Controller 中获取当前用户：
@Get('profile')
async getProfile(@Request() req) {
  return req.user  // { sub: userId, username: string }
}
```

#### 4.3.3 输入验证

使用 DTO 和 class-validator：

```typescript
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string

  @IsEmail()
  @IsOptional()
  email?: string
}
```

### 4.4 数据库操作规范

#### 4.4.1 查询优化

```typescript
// ✅ 使用 .exec() 返回真正的 Promise
const user = await this.userModel.findById(id).exec()

// ✅ 使用 .lean() 提升查询性能（只读）
const users = await this.userModel.find().lean().exec()

// ✅ 使用 .select() 限制返回字段
const users = await this.userModel
  .find()
  .select('username nickname email')
  .exec()

// ✅ 使用索引字段进行查询
const user = await this.userModel.findOne({ username }).exec()

// ✅ 批量查询使用 Promise.all
const [list, total] = await Promise.all([
  this.model.find(filter).exec(),
  this.model.countDocuments(filter).exec()
])
```

#### 4.4.2 分页查询标准

```typescript
async findAll(query: QueryDto) {
  const { page = 1, pageSize = 10 } = query
  const skip = (page - 1) * pageSize
  
  const [list, total] = await Promise.all([
    this.model
      .find()
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .exec(),
    this.model.countDocuments().exec()
  ])
  
  return {
    list,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  }
}
```

---

## 五、部署说明

### 5.1 环境变量配置

创建 `.env` 文件：

```env
# 服务配置
PORT=3000
NODE_ENV=production

# MongoDB 配置
MONGODB_URI=mongodb://localhost:27017/quizzyflow

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS 配置
CORS_ORIGIN=http://localhost:5173
```

### 5.2 生产环境部署

#### 5.2.1 构建项目

```bash
cd server
pnpm install
pnpm run build
```

#### 5.2.2 启动服务

```bash
# 方式1：直接启动
pnpm run start:prod

# 方式2：使用 PM2
pm2 start dist/main.js --name quizzyflow-api

# 方式3：使用 Docker
docker build -t quizzyflow-api .
docker run -p 3000:3000 quizzyflow-api
```

### 5.3 数据库管理

#### 5.3.1 备份数据库

```bash
mongodump --uri="mongodb://localhost:27017/quizzyflow" --out=/backup/$(date +%Y%m%d)
```

#### 5.3.2 恢复数据库

```bash
mongorestore --uri="mongodb://localhost:27017/quizzyflow" /backup/20250119
```

#### 5.3.3 创建索引

```bash
mongo quizzyflow --eval "
  db.users.createIndex({ username: 1 }, { unique: true });
  db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
  db.questions.createIndex({ author: 1 });
  db.questions.createIndex({ isPublished: 1 });
  db.questions.createIndex({ isDeleted: 1 });
  db.questions.createIndex({ isStar: 1 });
  db.questions.createIndex({ createdAt: -1 });
  db.answers.createIndex({ questionId: 1 });
  db.answers.createIndex({ submitter: 1 });
  db.answers.createIndex({ submitTime: -1 });
"
```

---

## 六、测试

### 6.1 单元测试

```bash
cd server
pnpm run test
```

### 6.2 E2E 测试

```bash
cd server
pnpm run test:e2e
```

### 6.3 测试覆盖率

```bash
cd server
pnpm run test:cov
```

---

## 七、常见问题

### 7.1 如何添加新的组件类型？

无需修改后端代码，后端的 `componentList` 是完全动态的，支持任意组件类型。前端添加新组件后，直接存储到数据库即可。

### 7.2 如何实现权限控制？

在 User Schema 中添加 `role` 字段，然后创建 `RolesGuard` 进行权限验证。

### 7.3 如何处理大量并发答卷提交？

1. 使用 Redis 做缓存和限流
2. 使用消息队列（如 RabbitMQ）异步处理
3. 数据库读写分离
4. 使用 MongoDB 分片

### 7.4 如何导出答卷数据？

添加导出接口，使用 `xlsx` 库生成 Excel 文件：

```typescript
import * as XLSX from 'xlsx'

async exportAnswers(questionId: string) {
  const answers = await this.answerModel
    .find({ questionId })
    .lean()
    .exec()
  
  const ws = XLSX.utils.json_to_sheet(answers)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Answers')
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}
```

---

## 八、附录

### 8.1 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run start:dev

# 生产构建
pnpm run build

# 启动生产服务
pnpm run start:prod

# 生成模块
nest g module feature
nest g controller feature
nest g service feature

# 测试
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

### 8.2 相关文档

- NestJS 官方文档: https://docs.nestjs.com/
- Mongoose 官方文档: https://mongoosejs.com/
- MongoDB 官方文档: https://www.mongodb.com/docs/
- JWT 介绍: https://jwt.io/

---

## 文档更新日志

| 版本 | 日期 | 说明 | 作者 |
|------|------|------|------|
| v1.0.0 | 2025-01-19 | 初始版本，完整的后端开发指南 | - |

---

**文档结束**

