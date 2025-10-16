# Material 物料组件库

## 概述

本目录包含 QuizzyFlow 问卷系统的所有物料组件。物料组件是构建问卷的基础单元，每个组件都是独立、可配置且可复用的模块。

## 架构设计

### 整体架构

```
material/
├── index.ts                    # 组件配置中心
├── edit-canvas.tsx             # 画布编辑器
├── question-title/             # 标题组件
├── question-paragraph/         # 段落组件
├── question-info/              # 提示信息组件
├── question-input/             # 输入框组件
├── question-textarea/          # 文本域组件
├── question-radio/             # 单选组件
└── question-checkbox/          # 多选组件
```

### 组件分组

组件按照功能特性分为三大类：

#### 1. 文本显示类 (Text Display)
- **标题 (question-title)**: 用于显示各级标题，支持动画、打字机效果
- **段落 (question-paragraph)**: 用于显示段落文本
- **提示信息 (question-info)**: 用于显示提示、说明信息

#### 2. 用户输入类 (User Input)
- **输入框 (question-input)**: 单行文本输入
- **文本域 (question-textarea)**: 多行文本输入

#### 3. 用户选择类 (User Selection)
- **单选 (question-radio)**: 单选题，带统计功能
- **多选 (question-checkbox)**: 多选题，带统计功能

## 📦 组件标准结构

每个组件目录遵循统一的结构规范：

```
question-xxx/
├── index.ts            # 组件配置导出（必需）
├── index.tsx           # 画布显示组件（必需）
├── interface.ts        # TypeScript 类型定义（必需）
├── xxx-props.tsx       # 属性编辑组件（必需）
└── stat-component.tsx  # 统计组件（可选，仅选择类组件）
```

### 文件说明

#### `index.ts` - 组件配置文件
导出组件的完整配置对象，包含：
```typescript
{
  title: string                    // 组件显示名称
  type: string                     // 组件唯一标识符
  component: FC                    // 画布显示组件
  PropComponent: FC                // 属性编辑组件
  defaultProps: object             // 默认属性值
  statisticsComponent?: FC         // 统计组件（可选）
}
```

#### `index.tsx` - 画布显示组件
实现组件在画布中的渲染逻辑，接收 props 并展示对应的 UI。

#### `interface.ts` - 类型定义文件
定义组件的 TypeScript 接口和默认数据：
```typescript
export interface IQuestionXxxProps {
  // 组件属性定义
}

export const QuestionXxxDefaultData: IQuestionXxxProps = {
  // 默认值
}
```

#### `xxx-props.tsx` - 属性编辑组件
提供组件属性的可视化编辑界面，允许用户配置组件的各项属性。

#### `stat-component.tsx` - 统计组件（可选）
仅用于选择类组件（单选、多选），展示答题统计数据和图表。

## 核心配置文件

### `index.ts` - 组件配置中心

提供以下核心功能：

#### 1. 类型定义

```typescript
// 组件 Props 联合类型
export type ComponentPropsType = 
  IQuestionInputProps & 
  IQuestionTitleProps & 
  // ... 其他组件 Props

// 统计组件 Props 类型
export type ComponentsStatisticsType = 
  IComponentsStatisticsProps & 
  ICheckboxStatisticsProps

// 组件配置接口
export interface ComponentConfigType {
  title: string
  type: string
  component: FC<ComponentPropsType>
  PropComponent: FC<ComponentPropsType>
  defaultProps: ComponentPropsType
  statisticsComponent?: FC<ComponentsStatisticsType>
}
```

#### 2. 组件配置列表

```typescript
const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTitleConfig,
  QuestionParagraphConfig,
  QuestionInfoConfig,
  QuestionTextareaConfig,
  QuestionRadioConfig,
  QuestionCheckboxConfig,
]
```

#### 3. 组件分组配置

```typescript
export const componentConfigGroup = [
  {
    groupName: '文本显示',
    components: [QuestionTitleConfig, QuestionParagraphConfig, QuestionInfoConfig]
  },
  {
    groupName: '用户输入',
    components: [QuestionInputConfig, QuestionTextareaConfig]
  },
  {
    groupName: '用户选择',
    components: [QuestionRadioConfig, QuestionCheckboxConfig]
  }
]
```

#### 4. 工具函数

```typescript
// 根据类型获取组件配置
export function getComponentConfigByType(type: string): ComponentConfigType
```

### `edit-canvas.tsx` - 画布编辑器

画布编辑器是组件的渲染容器，提供以下功能：

#### 核心特性
- ✅ 组件动态渲染
- ✅ 拖拽排序支持
- ✅ 组件选中/激活状态
- ✅ 组件锁定/隐藏
- ✅ 键盘快捷键支持
- ✅ 响应式布局（左对齐、居中、右对齐）
- ✅ 背景图片和视差滚动效果
- ✅ 加载状态处理

#### 主要功能

1. **组件渲染**
```typescript
function genComponent(componentInfo: QuestionComponentType) {
  const { type, props } = componentInfo
  const componentConfig = getComponentConfigByType(type)
  const { component: Component } = componentConfig
  return <Component {...props} />
}
```

2. **布局配置**
- 支持页面内边距 (padding)
- 支持最大宽度 (maxWidth)
- 支持三种布局对齐方式（左/中/右）
- 支持圆角配置 (borderRadius)

3. **背景配置**
- 背景图片
- 背景位置、重复、大小
- 视差滚动效果

4. **交互功能**
- 点击选中组件
- 拖拽重新排序
- 过滤隐藏组件
- 锁定组件禁止操作

## 使用指南

### 添加新组件

1. **创建组件目录**
```bash
mkdir question-newtype
cd question-newtype
```

2. **创建必需文件**

**interface.ts**
```typescript
export interface IQuestionNewTypeProps {
  // 定义组件属性
  title?: string
  // ...
}

export const QuestionNewTypeDefaultData: IQuestionNewTypeProps = {
  title: '默认标题',
  // ...
}
```

**index.tsx**
```typescript
import React from 'react'
import { IQuestionNewTypeProps } from './interface'

const QuestionNewType: React.FC<IQuestionNewTypeProps> = (props) => {
  const { title } = props
  return <div>{title}</div>
}

export default QuestionNewType
```

**newtype-props.tsx**
```typescript
import React from 'react'
import { IQuestionNewTypeProps } from './interface'

const NewTypeProps: React.FC<IQuestionNewTypeProps> = (props) => {
  const { title, onChange } = props
  
  return (
    <div>
      <label>标题</label>
      <input 
        value={title} 
        onChange={(e) => onChange?.({ title: e.target.value })}
      />
    </div>
  )
}

export default NewTypeProps
```

**index.ts**
```typescript
import QuestionNewType from './index.tsx'
import NewTypeProps from './newtype-props.tsx'
import { QuestionNewTypeDefaultData } from './interface.ts'

export * from './interface.ts'

export default {
  title: '新组件',
  type: 'question-newtype',
  component: QuestionNewType,
  PropComponent: NewTypeProps,
  defaultProps: QuestionNewTypeDefaultData,
}
```

3. **注册到配置中心**

在 `material/index.ts` 中：
```typescript
// 导入
import QuestionNewTypeConfig from './question-newtype'
import { IQuestionNewTypeProps } from './question-newtype'

// 添加到类型定义
export type ComponentPropsType = 
  // ... existing types
  IQuestionNewTypeProps

// 添加到配置列表
const componentConfigList: ComponentConfigType[] = [
  // ... existing configs
  QuestionNewTypeConfig,
]

// 添加到分组（可选）
export const componentConfigGroup = [
  // ... existing groups
  {
    groupName: '新分组',
    components: [QuestionNewTypeConfig]
  }
]
```

### 使用组件配置

```typescript
import { getComponentConfigByType, componentConfigGroup } from '@/components/material'

// 获取单个组件配置
const config = getComponentConfigByType('question-title')

// 遍历分组
componentConfigGroup.forEach(group => {
  console.log(group.groupName)
  group.components.forEach(component => {
    console.log(component.title, component.type)
  })
})
```

## 组件设计原则

1. **独立性**: 每个组件应该是独立的模块，不依赖其他物料组件
2. **可配置性**: 组件应该提供丰富的配置选项
3. **类型安全**: 使用 TypeScript 确保类型安全
4. **统一结构**: 遵循标准的文件结构和命名规范
5. **Props 驱动**: 组件应该完全由 props 控制，无内部状态（受控组件）
6. **默认值**: 每个组件必须提供合理的默认值

## 扩展阅读

### 技术栈

- **React 18**: 组件开发
- **TypeScript**: 类型安全
- **Redux Toolkit**: 状态管理
- **Ant Design**: UI 组件库
- **dnd-kit**: 拖拽排序

## 🤝 贡献指南

添加新组件时请确保：
- ✅ 遵循标准文件结构
- ✅ 提供完整的 TypeScript 类型定义
- ✅ 实现默认属性值
- ✅ 组件支持 disabled 状态
- ✅ 属性编辑组件提供良好的用户体验
- ✅ 在配置中心正确注册

## 📝 更新日志

当前支持的组件：
- ✅ 标题 (question-title)
- ✅ 段落 (question-paragraph)
- ✅ 提示信息 (question-info)
- ✅ 输入框 (question-input)
- ✅ 文本域 (question-textarea)
- ✅ 单选 (question-radio)
- ✅ 多选 (question-checkbox)

---

📧 如有问题或建议，请联系开发团队。
