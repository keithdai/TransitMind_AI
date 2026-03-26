# 企业级主题新增与全面适配 Spec

## Why

当前系统使用的是科幻风格（dark）主题，不符合政务办公场景的专业稳重形象。需要基于《数字化转型平台前端界面设计规范》新增一个企业级主题，体现千万级项目的质感，并设为默认风格。

## What Changes

- 新增 `enterprise` 主题，基于 Ant Design 设计规范
- 将 `enterprise` 设为默认主题
- 更新所有页面的样式以适配新主题
- 更新按钮、表单、卡片等组件样式
- 更新登录页面样式
- 更新导航和布局样式
- 更新设置页面的主题选择

## Impact

- Affected specs: ThemeContext, index.css, 所有页面组件
- Affected code: 
  - `src/contexts/ThemeContext.tsx`
  - `src/index.css`
  - `src/pages/Login.tsx`
  - `src/pages/Home.tsx`
  - `src/pages/Marketplace.tsx`
  - `src/pages/Workspace.tsx`
  - `src/pages/Settings.tsx`
  - `src/components/Layout.tsx`
  - 所有使用主题变量的组件

## ADDED Requirements

### Requirement: 企业级主题样式

系统应提供企业级主题样式，符合以下规范：

#### Scenario: 主题配色
- **WHEN** 用户选择企业级主题
- **THEN** 系统使用以下配色：
  - 主色：#1890FF（蓝色）
  - 成功色：#52C41A（绿色）
  - 警告色：#FAAD14（橙色）
  - 错误色：#F5222D（红色）
  - 背景色：#F5F5F5（浅灰）
  - 卡片背景：#FFFFFF（白色）
  - 文字颜色：#262626（标题）、#595959（正文）、#8C8C8C（辅助）

#### Scenario: 组件样式
- **WHEN** 用户使用企业级主题
- **THEN** 所有组件符合设计规范：
  - 按钮：圆角4px，主按钮蓝色填充
  - 卡片：圆角8px，白色背景，轻微阴影
  - 表单：输入框高度32px，边框#D9D9D9
  - 表格：斑马纹样式，悬停高亮
  - 导航：高度56px，侧边栏200px

### Requirement: 默认主题设置

系统应将企业级主题设为默认：

#### Scenario: 新用户访问
- **WHEN** 新用户首次访问系统
- **THEN** 系统默认使用企业级主题

#### Scenario: 主题持久化
- **WHEN** 用户切换主题后刷新页面
- **THEN** 系统保持用户选择的主题

### Requirement: 登录页面适配

登录页面应适配企业级主题：

#### Scenario: 登录页面样式
- **WHEN** 用户访问登录页面
- **THEN** 登录页面使用企业级设计：
  - 白色卡片背景
  - 蓝色主按钮
  - 清晰的表单布局
  - 底部版权信息

### Requirement: 所有页面全面适配

所有页面都应适配企业级主题：

#### Scenario: 页面样式一致性
- **WHEN** 用户浏览任意页面
- **THEN** 页面样式与企业级主题保持一致：
  - 首页：卡片布局，数据展示清晰
  - 智能体市场：网格布局，卡片悬浮效果
  - 工作台：对话界面清晰，输入框明显
  - 知识库：表格样式规范，操作按钮明显
  - 设置页面：表单布局整齐，开关样式统一
